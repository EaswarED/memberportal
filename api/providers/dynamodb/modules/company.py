from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, add_config_item, get_config_table, update_config_item, update_item
from shared.utilities import constant

logger = get_logger(__name__)

def list_company():
    items = get_config_items_by_key(constant.PREFIX_COMPANY)
    return items

def get_company(key_val):
    item = get_config_item_by_id(constant.PREFIX_COMPANY, key_val)
    return item

def save_company(company_cd, item):
    item['PK'] = constant.PREFIX_COMPANY
    item['SK'] = company_cd

    response = add_config_item(item)    # Calls put_item all the time
    return response

def update_company_class(sk, key_data):
       
    key = {
        'PK': constant.PREFIX_COMPANY,
        'SK': sk,
         }
    update_expr = "SET ClassList = :ClassList , GroupList = :GroupList , ContentList = :ContentList , ApptList= :ApptList"
    update_attr = {
        ":ClassList": key_data['ClassList'],
        ":GroupList": key_data['GroupList'],
        ":ApptList": key_data['ApptList'],
        ":ContentList": key_data['ContentList']
    }
    response= update_config_item(key,update_expr,update_attr)
    return response