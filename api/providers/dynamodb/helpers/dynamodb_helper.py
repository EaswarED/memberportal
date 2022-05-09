import boto3
from boto3.dynamodb.conditions import Key
import time
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from shared.utilities.decimal_encoder import replace_decimals

logger = get_logger(__name__)
dynamodb = boto3.resource("dynamodb")
stage = 'dev-'

def get_config_table():
    return dynamodb.Table(stage + "Mworx-Config")

def get_client_table():
    return dynamodb.Table(stage + "Mworx-Client")

def get_content_table():
    return dynamodb.Table(stage + "Mworx-Self-Care")

def get_payment_table():
    return dynamodb.Table(stage + "Mworx-Payment")

def get_config_item_by_id(key_val, sort_val):
    return get_item_by_id(get_config_table(), key_val, sort_val);

def get_client_item_by_id(key_val, sort_val):
    return get_item_by_id(get_client_table(), key_val, sort_val);

def get_content_item_by_id(key_val, sort_val):
    return get_item_by_id(get_content_table(), key_val, sort_val);

def get_payment_item_by_id(key_val, sort_val):
    return get_item_by_id(get_payment_table(), key_val, sort_val);


def get_item_by_id(table, key_val, sort_val):
    key = {'PK': key_val, 'SK': sort_val}    
    result = table.get_item(Key=key)
    return _get_items(result)

def get_payment_items_by_key(key_val):
    return get_items_by_key(get_payment_table(), key_val);

def get_config_items_by_key(key_val):
    return get_items_by_key(get_config_table(), key_val);

def get_client_items_by_key(key_val):
    return get_items_by_key(get_client_table(), key_val);

def get_content_items_by_key(key_val):
    return get_items_by_key(get_content_table(), key_val);   

def get_client_items_by_sk(key_val):
    return get_items_by_sk(get_client_table(), key_val)

def get_items_by_sk(table, key_val):
    result = table.scan(
        FilterExpression=Key('SK').eq(key_val)
    )
    return _get_items(result)

def get_items_by_key(table, key_val):
    result = table.query(
        KeyConditionExpression = Key('PK').eq(key_val)
    )
    return _get_items(result)

def add_config_item(item):
    return add_item(get_config_table(), item)

def add_client_item(item):
    return add_item(get_client_table(), item)

def add_content_item(item):
    return add_item(get_content_table(), item)

def add_payment_item(item):
    return add_item(get_payment_table(), item)    


def add_item(table, item):
    logger.debug(
        'add_item(): Attempting to Save Data in DynamoDB. Item {%s}', item)
    result = table.put_item(Item=item)
    return result

def update_config_item(key, update_expr, update_attr):
    return update_item(get_config_table(), key, update_expr, update_attr)

def update_client_item(key, update_expr, update_attr):
    return update_item(get_client_table(), key, update_expr, update_attr)

def update_content_item(key, update_expr, update_attr):
    return update_item(get_content_table(), key, update_expr, update_attr)

def update_payment_item(key, update_expr, update_attr):
    return update_item(get_payment_table(), key, update_expr, update_attr)


def update_item(table, key, update_expr, update_attr):
    logger.debug(
        'update_item(): Attempting to Save Data in DynamoDB. Item {%s}', key)
    response = table.update_item(
            Key = key,
            UpdateExpression = update_expr,
            ExpressionAttributeValues = update_attr,
            ReturnValues="UPDATED_NEW"
        )
    return response

def _get_items(result):
    if "Items" in result:
        return replace_decimals(result["Items"])
    elif "Item" in result:
        return replace_decimals(result["Item"])
    else:
        return []

def generate_id():
    id_table = dynamodb.Table('atomic_ids') 

    now = int(time.time())
    timestamp = str(now)
    response = id_table.update_item(
        Key = { 'timestamp': timestamp }, 
        UpdateExpression =' ADD id_counter :inc SET expiry=:exp',
        ExpressionAttributeValues = { ':inc': 1, ':exp': now+20},
        ReturnValues = 'UPDATED_NEW'
    )

    counter = int(response["Attributes"]["id_counter"])
    unique_id = timestamp + '_' + f'{counter:03d}'
    return unique_id;
