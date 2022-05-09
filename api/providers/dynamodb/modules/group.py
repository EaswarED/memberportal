import pandas as pd
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item
from shared.utilities import constant

logger = get_logger(__name__)


def list_group():
    items = get_config_items_by_key(constant.PREFIX_GROUP)
    return items


def get_group(key_val):
    item = get_config_item_by_id(constant.PREFIX_GROUP, key_val)
    return item


def save_group(class_id, item):
    item['PK'] = constant.PREFIX_GROUP
    item['SK'] = class_id

    response = add_config_item(item)    # Calls put_item all the time
    return response


def get_published_list():
    list = list_group()
    df = pd.json_normalize(list)
    df = Util.filter_df_by_column(df, 'Details.IsPublished', True)
    return df['SK'].astype('int64').to_list()
