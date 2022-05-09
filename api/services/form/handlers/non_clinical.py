from datetime import datetime
import json
from shared.exceptions.exception import APIValidationError
from shared.helpers.api_helper import build_custom_err_response, build_empty_response, build_err_response, build_response
from shared.helpers import session_helper
from providers.dynamodb.modules import  client
from shared.utilities.Util import Util

def receive_jotform(event, context):
    try:
        print(event)
        req_data = json.loads(event['body'])
        # req_data = 'submission_id=5203194374029574301&formID=220394777670162&ip=103.163.248.204&feedbacktype=Comments&clientid=100000004'
        print(req_data)
        # data = req_data.split('&')
        # data2= [i.split('=', 1)[1] for i in data]
        submission_id = int(req_data['submissionId'])
        client_id = int(req_data['clientId'])
        form_id = req_data['formId']
        # submission_id = int(data2[0])
        # client_id=int(data2[-1]) 
        # form_id=data2[1]
        # print(data2)
        epoch_time = Util.get_current_epoch()
 
        profile = client.get_client(client_id)
        epoch_time = Util.get_current_date_epoch()
        forms = Util.get_dict_data(profile, 'Forms')
        if not forms:
            forms = {}
        forms[form_id] = epoch_time  
        profile['Forms'] = forms
        result = client.save_client(client_id, profile)
        item = {
        'FormId': form_id,
        'Timestamp': epoch_time,
        'submission_id' : submission_id  
        }
        result = client.save_activity(client_id,epoch_time, item)
        
        return build_response(result,200)
        
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Private function

