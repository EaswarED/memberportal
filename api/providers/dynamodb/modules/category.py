from unicodedata import category
from providers.dynamodb.modules.promotion_access import _save
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import generate_id, get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item
from shared.utilities import constant

logger = get_logger(__name__)

def list_category():
    items = get_config_items_by_key(constant.PREFIX_CATEGORY)
    return items

def get_category(id):
    item = get_config_item_by_id(constant.PREFIX_CATEGORY, id)
    return item



def save_category(id, item):
    if not id:
        id = generate_id()

    item['PK'] = constant.PREFIX_CATEGORY
    item['SK'] = id

    add_config_item(item)    # Calls put_item all the time
    return item

def delete_item (obj_name,id):
    if not id:
        return None

    result = get_category(id)
    key={
              
                'SK': id
            },
    update_expr = "SET " + obj_name + " = :" + obj_name
    update_attr = {
        ":" + obj_name: result
    }
    result = _save(key,update_expr,update_attr)
    return(result)




