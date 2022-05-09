import pandas as pd
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from datetime import datetime
from shared.utilities.logger import get_logger
from shared.helpers import session_helper
from shared.utilities.Util import Util
from providers.mindbody.modules.appointment import available_date
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)

def list_available_date(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is requiired')
        staff_id = session_helper.get_staff_id(event)
        end_dt = session_helper.get_end_dt(event)

        sessiontype_id = session_helper.get_session_type_id(event)
        if not sessiontype_id:
            raise APIValidationError(
                'API Request is incomplete. Sessiontype_Id is required')
        params = {'staffIds': staff_id,'sessiontypeId': sessiontype_id}
        if end_dt:
             params['endDate'] = end_dt

        logger.debug('Retrieve availabledate for Parameters {%s}', params)
        resp_data = available_date.get_available_dates_list(params)
        data_array = Util.get_dict_data(resp_data, 'AvailableDates')
                
        dates = []
        for iso_ts in data_array:
            date = datetime.strptime(''.join(iso_ts.rsplit(':', 1)), '%Y-%m-%dT%H:%M:%S%z').date().strftime("%Y-%m-%d")
            dates.append(date)
        data =  dates,     
    
        return build_response(data)
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)



