import json
from tokenize import group
import pandas as pd
from shared.helpers.api_helper import build_err_response, build_response, build_msg_response, build_custom_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.dynamodb.modules import client, db_class
from shared.utilities import constant

logger = get_logger(__name__)

# Request to Join
def request_to_join (event, context):
    try:

        client_id= session_helper.get_client_id(event)
        group_id =  Util.get_path_param(event, 'id')
        epoch_time = Util.get_current_epoch()

        # Get Client Details
        print(client_id)
        profile = client.get_client(client_id)
        print(profile)
        list = Util.get_dict_data(profile, 'PendingGroups')
        if not list:
            list = []
        if group_id in list:
            return build_custom_err_response({},
                'Group request is already in Pending status')

        list.append(group_id)
        profile['PendingGroups'] = list
        result = client.save_client(client_id, profile)

        # Store in Group
        group = db_class.get_class(group_id)
        list = Util.get_dict_data(group, 'Pending')
        if not list:
            list = []

        pattern = str(client_id) + '#'
        if any(pattern in s for s in list):
            return build_custom_err_response({},
                'Client already has a request pending')

        list.append(pattern + str(epoch_time))
        group['Pending'] = list
        result = db_class.save_class(group_id, group)

        # Record Activity
        item = {
            'Type': constant.REQUEST_PENDING,
            'GroupId': group_id,
            'Timestamp': epoch_time
        }
        result = client.save_activity(client_id, epoch_time, item)
        return build_msg_response('Request submitted successfully')

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)



#Process Request
def process_request(event, context):
    try:
        req_data = json.loads(event['body'])
        print(req_data)

        client_id = req_data['clientId']
        group_id = req_data['groupId']
        status_type = req_data['statusType']
        # client_id = 100000004
        # group_id = '5'
        # status_type = 'A'

        epoch_time = Util.get_current_epoch()

        # Get Client Details
        profile = client.get_client(client_id)
        list = Util.get_dict_data(profile, 'PendingGroups')
        if not list or group_id not in list:
            return build_custom_err_response({},
                'No request pending at this time')

        list.remove(group_id)
        if status_type == constant.REQUEST_APPROVED:
            list = Util.get_dict_data(profile, 'ApprovedGroups')
            if not list:
                list = []
            list.append(group_id)
        elif status_type == constant.REQUEST_DENIED:
            list = Util.get_dict_data(profile, 'DeniedGroups')
            if not list:
                list = []
            list.append(group_id)
        else:
            return build_custom_err_response({},'Invalid Process Request')

        # Update the value in Group
        group = db_class.get_class(group_id)
        list = Util.get_dict_data(group, 'Pending')
        pattern = str(client_id) + '#'

        if not list or not any(pattern in s for s in list):
            logger.log(
                'No request pending request waitting for this client')
        elif not list:
            for item in list:
                if item.startswith(pattern):
                    list.remove(item)
            group['Pending'] = list

        if status_type == constant.REQUEST_APPROVED:
            list = Util.get_dict_data(group, 'Approved')
            if not list:
                list = []
            list.append(pattern + str(epoch_time))
            group['Approved'] = list
        else:
            list = Util.get_dict_data(profile, 'Denied')
            if not list:
                list = []
            list.append(group_id)
        result = db_class.save_class(group_id, group)

        return build_msg_response('Request processed successfully')
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

