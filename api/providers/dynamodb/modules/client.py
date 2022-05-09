from shared.exceptions.exception import APIValidationError
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_client_items_by_key, get_client_items_by_sk, get_client_item_by_id, add_client_item, update_client_item
from shared.utilities import constant

logger = get_logger(__name__)

def list_client():
    items = get_client_items_by_sk(constant.PREFIX_PROFILE)
    return items

def get_client(key_val):
    item = get_client_item_by_id(key_val, constant.PREFIX_PROFILE)
    return item


def save_client(client_id, item):
    item['PK'] = client_id
    item['SK'] = constant.PREFIX_PROFILE

    response = add_client_item(item)    # Calls put_item all the time
    return response


def save_activity(client_id, timestamp, item):
    item['PK'] = client_id
    item['SK'] = constant.PREFIX_ACTIVITY + str(timestamp)

    response = add_client_item(item)    # Calls put_item all the time
    return response


# OLD
def list_group(client_id):
    items = get_client_items_by_key(client_id)
    return items


def get_client_group(client_id, group_id):
    item = get_client_item_by_id(
        client_id, constant.PREFIX_GROUP + str(group_id))
    return item


def process_request(client_id, group_id, request_type):
    logger.debug(
        'Client: Attempting to Process Group Request for Parameters {%s}', request_type)

    item = get_client_group(client_id, group_id)
    if (len(item)) == 0:
        raise APIValidationError('No Group Request found for this user')

    details = item["Details"]
    if (details['StatusIn'] != constant.REQUEST_PENDING):
        raise APIValidationError('Group Request is not in Pending Status')

    if (request_type == constant.REQUEST_APPROVED):
        dt_attribute = 'ApprovedDt'
    elif (request_type == constant.REQUEST_DENIED):
        dt_attribute = 'DeniedDt'
    else:
        dt_attribute = 'WithdrawnDt'

    details['StatusIn'] = request_type
    details[dt_attribute] = Util.get_timestamp()

    key = {
        'PK': client_id,
        'SK': constant.PREFIX_GROUP + str(group_id),
    }
    update_expr = "SET Details = :Details"
    update_attr = {
        ":Details": details
    }

    item['Details'] = details
    return update_client_item(key, update_expr, update_attr)


def log_client_phq9(client_id):
    item = {
        'PK': client_id,
        'SK': constant.PREFIX_PHQ9,
        'Details': {
            'LastSubmissionDt': Util.get_timestamp()
        }
    }
    response = add_client_item(item)
