import pandas as pd
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.helpers.api_helper import build_custom_err_response, build_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.staff  import staff 

logger = get_logger(__name__)
def list_staff(event, context):
    try:
        params = {'limit':200}
        logger.debug('Retrieve Staff details  for Parameters {%s}', params)

        resp_data = staff.get_staff_list(params)
        data = Util.get_dict_data(resp_data, 'StaffMembers')
        df = pd.DataFrame(Util.to_lower_key(data))
        df['name'] = df['firstName'] + ' ' + df ['lastName']
        columns = ['id','name','bio']      
        df = Util.get_df_by_column(df, columns) 
        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
