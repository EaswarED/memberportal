import pandas as pd
from providers.dynamodb.modules.instructor import instructor_list
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.helpers.api_helper import build_custom_err_response, build_empty_response, build_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.staff  import staff 


logger = get_logger(__name__)
def list_staff(event, context):
    try:
        params = {}
        logger.debug('Retrieve Staff details  for Parameters {%s}', params)

        resp_data = staff.get_staff_list(params)
        data = Util.get_dict_data(resp_data, 'StaffMembers')
        df = pd.DataFrame(Util.to_lower_key(data))

        columns = ['id','firstName', 'lastName','bio','imageUrl']      
        df = Util.get_df_by_column(df, columns) 
        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def get_staff(event, context):
    try:
        id = Util.get_path_param(event, 'id')
        # id = '2'
        result = list_staff(event,context)

        result = staff.get_staff_list(params={'staffIDs':id})
        data = Util.get_dict_data(result, 'StaffMembers')
        if len(data).empty:
            df = pd.DataFrame(data)
            df['FirstName']=""
            df ['LastName']=""
            df ['Name']=""
        else:
            
            df = pd.DataFrame(data)
            df['Name'] = df['FirstName'] + ' ' + df ['LastName']
            columns = ['Name','Id']      
            df = Util.get_df_by_column(df, columns) 

        return build_response(Util.to_dict(df))

      
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)





