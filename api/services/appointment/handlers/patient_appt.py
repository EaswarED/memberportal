from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
import pandas as pd
import json
from cerberus import Validator
from providers.drchrono.modules.patient import patient_appt,add_appt
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
from schemas import patient_schema

logger = get_logger(__name__)

def list_patient_appts(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        since_dt = session_helper.get_since_date(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. Patient_Id is requiired')
        
        params = {
            'patient': patient_id
        }
        if since_dt:
            params['since'] = since_dt
        logger.debug('Retrieve Patient Appointments for Parameters {%s}', params)

        resp_data = patient_appt.get_appointment_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        if len(data)>0:

            df = pd.DataFrame(Util.to_lower_key(data))
            columns = ['id','doctor', 'exam_room','office','scheduled_time']
            df = Util.get_df_by_column(df, columns)

            return build_response(Util.to_dict(df))
        else:
            return build_response(data)

    except SecurityException as e:
        return build_security_response({}, e)       
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#Add Patient Appointment
def add_patient_appointment(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
  
        validator = Validator(patient_schema.PatientAppointmentPOSTSchema,
                           purge_readonly=True)
        if not validator.validate(req_data):
            raise APIValidationError(Util.to_str(validator.errors))

        if req_data:
             req_data = json.dumps(req_data)
        resp_data= add_appt.add_patient_appt(req_data)

        return build_response(resp_data) 

    except SecurityException as e:
        return build_security_response({}, e)    
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
