import pandas as pd
from shared.helpers.api_helper import build_response, build_err_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.site  import program 


logger = get_logger(__name__)
def list_class_program(event, context):
    return  _list_program('Class')    
    
def list_appt_program(event, context):
    return _list_program('Appointment')
    
def _list_program (type):
    try:

        params={"ScheduleType": type}
        logger.debug( 'Retrieve Programs for the Params {%s}',params)
        
        resp_data = program.get_program_list(params)
        data = Util.get_dict_data(resp_data, 'Programs')
        if len(data)>0:
            df = pd.DataFrame(Util.to_lower_key(data))

            columns = ['id','name']              
            df = Util.get_df_by_column(df, columns)

            return build_response(Util.to_dict(df))
        else:
            return build_response(data)

    except Exception as e:
        return build_err_response({}, e)

