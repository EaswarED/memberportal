from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import generate_id, get_config_items_by_key,  add_config_item, get_config_item_by_id
from shared.utilities import constant

logger = get_logger(__name__)


def list_form(form_type):
    if (form_type == constant.FORM_CLINICAL):
        return get_config_items_by_key(constant.PREFIX_FORM_CLINICAL)
    else:
        return get_config_items_by_key(constant.PREFIX_FORM_NCLINICAL)


def get_form(form_type, id):
    if (form_type == constant.FORM_CLINICAL):
        return get_config_item_by_id(constant.PREFIX_FORM_CLINICAL, id)
    else:
        return get_config_item_by_id(constant.PREFIX_FORM_NCLINICAL, id)


def save_form(form_type, id, item):
    if not id:
        id = generate_id()

    if form_type == constant.FORM_CLINICAL:
        item['PK'] = constant.PREFIX_FORM_CLINICAL
    else:
        item['PK'] = constant.PREFIX_FORM_NCLINICAL

    item['SK'] = id
    add_config_item(item)
    return item

    
