from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item , generate_id
from shared.utilities import constant

logger = get_logger(__name__)

def instructor_list():
    items = get_config_items_by_key(constant.PREFIX_INSTRUCTOR)
    return items

def get_instructor(id):
    item = get_config_item_by_id(constant.PREFIX_INSTRUCTOR, id)
    return item

def save_instructor(provider_id, item):
   
    item['PK'] = constant.PREFIX_INSTRUCTOR
    item['SK'] = provider_id

    add_config_item(item)    # Calls put_item all the time
    return item

def update_provider_class(sk, key_data):
       
    key = {
        'PK': constant.PREFIX_INSTRUCTOR,
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