import json
import pandas as pd
import numpy as np
from cerberus import Validator
from shared.helpers.api_helper import _build_response, build_custom_err_response, build_empty_response, build_err_response, build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.dynamodb.modules import company
from shared.exceptions.exception import APIValidationError, SecurityException
from schema import company_config,del_class_company,class_company
from providers.mindbody.modules.client import get_client

logger = get_logger(__name__)
def save_company(event, context):
    try:

        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        result = company.list_company()
        df = pd.json_normalize(result)
        columns = ['Details.Code','SK']
        dynodb_df = Util.get_df_by_column(df,columns)
        dynodb_df = dynodb_df[dynodb_df['Details.Code'] == req_data['code']]
        
        if dynodb_df.empty:
            details = {
                'Name': req_data['name'],
                'Email': req_data['email']
                
            }
            details['Code'] = req_data['code']
            
            item = {
                'Details': details,
                
            }
            result = company.save_company(req_data['id'], item)
            logger.debug(result)
        else:
            result={
                'msg':'Company code exists'
            } 


        return build_response(result) 
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Add company from Class
def add_class_company(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        validator = Validator(class_company.ClassCompanyAddPOSTSchema,
                              purge_readonly=True)
        if not validator.validate(req_data):
           raise APIValidationError(Util.to_str(validator.errors))
        list_data = req_data['Item']
        for rec in req_data['Code']:
            result = company.get_company(rec)
        
            class_list = [x for x in result['ClassList']]
            class_data= list(set(class_list) | set(list_data['ClassList']))

            group_list = [x for x in result['GroupList']]
            group_data= list(set(group_list) | set(list_data['GroupList']))

            session_list = [x for x in result['ApptList']]
            session_data= list(set(session_list) | set(list_data['ApptList']))

            content_list = [x for x in result['ContentList']]
            content_data= list(set(content_list) | set(list_data['ContentList']))
                    

            item = {
                        'ClassList': class_data,
                        'GroupList': group_data,
                        'ApptList': session_data,
                        'ContentList': content_data
                    }
            result = company.update_company_class(rec, item)
            logger.debug(result)
            
        
            return build_response(result) 
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
#Get the  list of Companies


def list_company(event, context):
    df, dynodb_df = _list()
    print("df",df)
    print("df1",dynodb_df)
    # Merge Data
    merge_df = pd.merge(df, dynodb_df, left_on=[
        'Id'], right_on=['SK'], how="outer")
    merge_df["Name"] = merge_df["LastName"].fillna(merge_df["Details.Name"])
    merge_df["Email"] = merge_df["Email"].fillna(merge_df["Details.Email"])
    print(merge_df.dtypes)
    return build_response(Util.to_dict(merge_df ))

def select_company(event,context):
    
    df, dynodb_df = _list()
    
    # Merge Data
    merge_df = pd.merge(df, dynodb_df, left_on=[
        'Id'], right_on=['SK'], how="inner")
    merge_df["Name"] = merge_df["LastName"].fillna(merge_df["Details.Name"])
    merge_df["Email"] = merge_df["Email"].fillna(merge_df["Details.Email"])
    
    return build_response(Util.to_dict(merge_df ))
    
def _list():
    try:
        # Get Company
        resp_data = get_client.get_view_client({})
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.DataFrame(resp_data)
        columns = ['LastName','FirstName','Id','Country','State','Email','MobilePhone','AddressLine1','City','PostalCode','IsCompany']      
        df = Util.get_df_by_column(df, columns)      
        df = Util.filter_df_by_column(df, 'IsCompany', True)
        
        result = company.list_company()
        dynodb_df = pd.json_normalize(result)
        
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK"])

        return df, dynodb_df

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
#Remove Class from Company
def delete_class_list(event, context):
    try:  
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        validator = Validator(del_class_company.DeleteConfigPOSTSchema,
                              purge_readonly=True)
        if not validator.validate(req_data):
           raise APIValidationError(Util.to_str(validator.errors))
        
        result = company.get_company(req_data['Code'])
        list_data = req_data['Item']
        class_list = [x for x in result['ClassList']]
        group_list = [x for x in result['GroupList']]
        session_list = [x for x in result['ApptList']]
        content_list = [x for x in result['ContentList']]

        #Get company details
        if list_data['ClassList']:
            index = class_list.index(list_data['ClassList'])
            class_list.pop(index)
        elif list_data['GroupList']:
            index = group_list.index(list_data['GroupList'])
            group_list.pop(index)
        elif list_data['ApptList']:
            index = session_list.index(list_data['ApptList'])
            session_list.pop(index)
        elif list_data['ContentList']:
            index = content_list.index(list_data['ContentList'])
            content_list.pop(index)

        item = {
                    'ClassList': class_list,
                    'GroupList': group_list,
                    'ApptList': session_list,
                    'ContentList': content_list 
                }
           
        result = company.update_company_class(req_data['Code'], item)
        logger.debug(result)

        return _build_response(result['Attributes'], result['ResponseMetadata']['HTTPStatusCode'])  

    except APIValidationError as e:
        return build_custom_err_response({}, e)

def get_company(event, context):
    try:
        id = Util.get_path_param(event, 'id')

        if not id:
            return build_empty_response()

        result=company.get_company(id)

        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)