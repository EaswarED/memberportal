import pandas as pd
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import  add_config_item, add_payment_item, get_payment_item_by_id, get_payment_items_by_key, update_payment_item
from shared.utilities import constant
import time

logger = get_logger(__name__)


def get_payment(client_id,session_id):
    item = get_payment_item_by_id(client_id,session_id)
    return item


def save_payment(client_id,session_id, item):
    item['PK'] = str(client_id)
    item['SK'] = session_id

    response = add_payment_item(item)    # Calls put_item all the time
    return response

def update_payment(client_id,session_id, data,EpochTime):
    
    key = {
        'PK': str(client_id),
        'SK': session_id,
         }
    
    update_expr = "SET PaymentStatus = :PaymentStatus , EpochTime = :timestamp , ErrorDetail = :ErrorDetail" 

    update_attr = {
        ":PaymentStatus": data['PaymentStatus'],    
        ":timestamp": EpochTime,
        ":ErrorDetail": data['ErrorDetail']
       
    }
    
    response= update_payment_item(key,update_expr,update_attr)
    return response


