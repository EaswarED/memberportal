import json
import pandas as pd
from shared.helpers.api_helper import _build_response, build_custom_err_response, build_empty_response, build_err_response, build_msg_response, build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.dynamodb.modules import group, category,client, db_class
from providers.mindbody.modules.client import get_client
from shared.helpers import session_helper
from shared.utilities import constant

logger = get_logger(__name__)

# Dynamodb save Class


def list_group(event, context):
    try:
        # Retrieve Group Details
        result = group.list_group()
        group_df = pd.json_normalize(result)
        # Added Check to check if valid Dataframe exists
        if group_df.empty:
            group_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        group_columns = {'Details.CategoryId': 'CategoryId', 'Access.GlobalIn': 'AccessGlobalIn',
                         'Promotion.GlobalIn': 'PromotionGlobalIn', 'Details.IsPublished': 'IsPublished', 'Details.Name': 'Name','Details.Isopen':'IsOpen'}
        group_df.rename(columns=group_columns, inplace=True)
        group_columns = ['Name', 'CategoryId', 'SK', 'AccessGlobalIn',
                         'PromotionGlobalIn', 'IsPublished', 'Name','IsOpen']
        group_df = Util.get_df_by_column(group_df, group_columns)

        # Retrieve Category
        category_result = category.list_category()
        category_df = pd.DataFrame(category_result)
        # Added Check to check if valid Dataframe exists
        if category_df.empty:
            category_df = pd.DataFrame(columns=["ParentId"])
        category_column = {'Name': 'CategoryName', 'SK': 'ParentId'}
        category_df.rename(columns=category_column, inplace=True)
        category_column = ['ParentId', 'CategoryName']
        category_df = Util.get_df_by_column(category_df, category_column)

        # Merge
        final_df = pd.merge(group_df, category_df, left_on=[
            "CategoryId"], right_on=["ParentId"], how='left')
        columns = ['SK', 'Name', 'AccessGlobalIn', 'CategoryId', 'CategoryName',
                   'PromotionGlobalIn', 'IsPublished','IsOpen']
        final_df = Util.get_df_by_column(final_df, columns)

        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)



def save_group(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        req_data = json.loads(event['body'])
        result = db_class.get_class(req_data['id'])
        df= pd.json_normalize(result)
        print(df)
        
        details = {
            'IsPublished': req_data['isPublished'],
            'Name': req_data['name'],
            'CategoryId': req_data['categoryId'],
            'GroupType': req_data['groupType'],
            'IsOpen': req_data['isOpen']
            
        }
        item = {
                'Details': details,
                'FormsList': req_data['formsList']
            }

        result = group.save_group(req_data['id'], item)
        return build_response(result,200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def get_group(event, context):
    try:
        id = Util.get_path_param(event, 'id')
        if not id:
            return build_empty_response()

        result = group.get_group(id)

        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)




#Process Request
def process_request(event, context):
    try:
        client_id= session_helper.get_client_id(event)
       
        req_data = json.loads(event['body'])
        group_id = req_data['groupId']
        status_type = req_data['statusType']
        #client_id = 100000004
        #group_id = '12'
        #status_type = 'A'

        group_id = group_id + ''

        # Get Client Details
        profile = client.get_client(client_id)
        list = Util.get_dict_data(profile, 'PendingGroups')

        if not list or group_id not in list:
            return build_custom_err_response({},
                'No request pending at this time')
    
        list.remove(group_id)
        profile['PendingGroups'] = list

        if status_type == constant.REQUEST_APPROVED:
            column = 'ApprovedGroups'
            db_column = 'DeniedGroups'
        elif status_type == constant.REQUEST_DENIED:
            column = 'DeniedGroups'
            db_column = 'ApprovedGroups'
        else:
            return build_custom_err_response({},'Invalid Process Request')

        list = Util.get_dict_data(profile, column)
        if not list:
            list = []
        if not group_id in list:
            list.append(group_id)

        db_list = Util.get_dict_data(profile, db_column)
        if db_list and group_id in db_list:
            db_list.remove(group_id)
            profile[db_column] = db_list


        profile[column] = list
        result = client.save_client(client_id, profile)

        # Update the value in Group
        group = db_class.get_class(group_id)
        list = Util.get_dict_data(group, 'Pending')
        pattern = str(client_id) + '#'

        if not list or not any(pattern in s for s in list):
            logger.debug(
                'No request pending request waitting for this client')
        elif list:
            for item in list:
                if item.startswith(pattern):
                    list.remove(item)
            group['Pending'] = list

        if status_type == constant.REQUEST_APPROVED:
            column = 'Approved'
            db_column = 'Denied'
        else:
            column = 'Denied'
            db_column = 'Approved'

        db_list = Util.get_dict_data(group, db_column)
        if db_list:
            for item in db_list:
                print('For')
                print(item)
                if item.startswith(pattern):
                    print('Maatch')
                    db_list.remove(item)
            group[db_column] = db_list

        list = Util.get_dict_data(group, column)
        if not list:
            list = []

        epoch_time = Util.get_current_epoch()
        list.append(pattern + str(epoch_time))
        group[column] = list
        result = db_class.save_class(group_id, group)

        return build_msg_response(result,'Request processed successfully')

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def pending_request(event, context):
    group_id = Util.get_path_param(event, 'id')
    return _requests(group_id, constant.REQUEST_PENDING)

def approved_request(event, context):
    group_id = Util.get_path_param(event, 'id')
    return _requests(group_id, constant.REQUEST_APPROVED)

def denied_request(event, context):
    group_id = Util.get_path_param(event, 'id')
    return _requests(group_id, constant.REQUEST_DENIED)


def _requests(group_id, status_type):
    try:
        logger.debug('Retrieve client details {%s}')   

        if not group_id:
            return build_empty_response()
        result = db_class.get_class(group_id)
        if status_type == constant.REQUEST_PENDING:
            clients = Util.get_dict_data(result, 'Pending')
        elif status_type == constant.REQUEST_APPROVED:
            clients = Util.get_dict_data(result, 'Approved')
        else:
            clients = Util.get_dict_data(result, 'Denied')

        logger.debug('Retrieve client details {%s}')

        if not clients:
            return build_empty_response()

        data = [i.split('#', 1)[0] for i in clients]
        data2= [i.split('#', 1)[1] for i in clients]

        df = pd.DataFrame({'client':data,'time':data2})
        columns=['client','time']
        df = Util.get_df_by_column(df, columns) 
        
        resp_data = get_client.get_view_client({})
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        list_df = pd.DataFrame(Util.to_lower_key(resp_data))

        columns = ['firstName','lastName','email','id']
       
        list_df = Util.get_df_by_column(list_df, columns)
        merge_df = pd.merge(df, list_df, left_on=[
            'client'], right_on=['id'], how="inner")
        data_resp = Util.to_dict(merge_df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp)
    
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

