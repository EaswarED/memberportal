import pandas as pd
from shared.helpers.api_helper import build_response, build_err_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.site  import  session_type

logger = get_logger(__name__)

def list_session_appt(event, context):
    return _list_session_type('Appointment')

def list_session_class(event, context):
    return _list_session_type('Class')

def list_session_group(event, context):
    return _list_session_type('Enrollment')
    
def _list_session_type(type):
    try:
        params = {}
        logger.debug('Retrieve SessionTypes  for Parameters {%s}', params)
        
        resp_data = session_type.get_session_type_list(params)
        data = Util.get_dict_data(resp_data, 'SessionTypes')
        if len(data)>0:
            df = pd.DataFrame(Util.to_lower_key(data))

            df = Util.filter_df_by_column(df, 'type', type)
            columns = ['id', 'name','programId']      
            df = Util.get_df_by_column(df, columns) 
            
            return build_response(Util.to_dict(df))
        else:
            return build_response(data)

    except Exception as e:
        return build_err_response({}, e)