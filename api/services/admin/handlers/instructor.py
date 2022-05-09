import pandas as pd
import numpy as np
import json
from shared.helpers.api_helper import _build_response, build_custom_err_response, build_err_response,  build_response , build_empty_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from cerberus import Validator
from providers.dynamodb.modules import instructor
from providers.mindbody.modules.staff import staff
from shared.exceptions.exception import APIValidationError, SecurityException
from schema import instructor_class,del_class_instructor


logger = get_logger(__name__)

#List from DB
def instructor_list(event, context):
    try:
        params = {}
        logger.debug('Retrieve Staff details  for Parameters {%s}', params)

        resp_data = staff.get_staff_list(params)
        data = Util.get_dict_data(resp_data, 'StaffMembers')
        df = pd.DataFrame(data)
        df['Name'] = df['FirstName'] + ' ' + df ['LastName']
        columns = ['Id','Name','Bio']      
        df = Util.get_df_by_column(df, columns) 
        print(df)

        result = instructor.instructor_list()
        result = pd.json_normalize(result)
        result = pd.DataFrame(result)  
        if result .empty:
           result  = pd.DataFrame(columns=["SK"])
        provider_rename = {'Details.Name':'Staffname','Details.Bio':'Staffbio'}
        result.rename(columns = provider_rename, inplace = True) 
        result['SK'] = result['SK'].astype('int64')
        columns = ['Staffname','Staffbio','SK']
        result = Util.get_df_by_column(result, columns)
        print(result)
        #merge
        merge_df = pd.merge(df,result,left_on = 'Id',right_on = 'SK',how ='outer')
        merge_df["Bio"] = merge_df["Staffbio"].fillna(
            merge_df["Bio"])
        merge_df["Name"] = merge_df["Staffname"].fillna(
            merge_df["Name"])
        columns = ['Id','Bio','Name','SK']
        merge_df = Util.get_df_by_column(merge_df, columns)
        merge_df = merge_df.replace(np.nan,"")
        return build_response(Util.to_dict(merge_df))

          
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

        
        
def add_class_staff(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        validator = Validator(instructor_class.ClassStaffAddPOSTSchema,
                              purge_readonly=True)
        if not validator.validate(req_data):
           raise APIValidationError(Util.to_str(validator.errors))
        list_data = req_data['Item']   
        for rec in req_data['StaffId']:
            result = instructor.get_instructor(rec)
        
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
            result = instructor.update_provider_class(rec, item)
            logger.debug(result)
        return _build_response(result['Attributes'], result['ResponseMetadata']['HTTPStatusCode'])  

    except APIValidationError as e:
        return build_custom_err_response({}, e)



def delete_class_staff(event, context):
    try:
        
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        validator = Validator(del_class_instructor.DeleteInstructConfigPOSTSchema,
                              purge_readonly=True)
        if not validator.validate(req_data):
           raise APIValidationError(Util.to_str(validator.errors))
        result = instructor.get_instructor(req_data['StaffId'])
        list_data = req_data['Item']
        class_list = [x for x in result['ClassList']]
        group_list = [x for x in result['GroupList']]
        session_list = [x for x in result['ApptList']]
        content_list = [x for x in result['ContentList']]
        
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
           
        result = instructor.update_provider_class(req_data['StaffId'], item)
        logger.debug(result)

        return _build_response(result['Attributes'], result['ResponseMetadata']['HTTPStatusCode'])  

          
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)




def get_instructor(event, context):
    try:
        id = Util.get_path_param(event, 'id')

        if not id:
            return build_empty_response()
        
        result = instructor.get_instructor(id)


        return build_response(result)

          
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


def save_instructor(event, context):
    try:
       
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        result = instructor.get_instructor(req_data['id'])
        df= pd.json_normalize(result)
        print(df)
        details = {
            'Name': req_data['name'],
            'ZoomLink':req_data['zoomlink']
        }

        item = {
            'Details': details,
            
        }
       

        result = instructor.save_instructor(req_data['id'], item)
        logger.debug(result)

        return build_response(result,200) 

           
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)



