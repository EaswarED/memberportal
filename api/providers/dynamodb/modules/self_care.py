
import pandas as pd
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import add_client_item, add_content_item, generate_id, get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item, get_content_items_by_key, get_content_item_by_id
from shared.utilities import constant

logger = get_logger(__name__)


def list_category():
    items = get_config_items_by_key(constant.PREFIX_CATEGORY)
    return items


def get_category(key_val):
    item = get_config_item_by_id(constant.PREFIX_CATEGORY, key_val)
    return item


def save_category(category_name, item):
    item['PK'] = constant.PREFIX_CATEGORY
    item['SK'] = category_name

    response = add_config_item(item)    # Calls put_item all the time
    return response

# Vimeo Type details


def type():
    items = get_config_items_by_key(constant.PREFIX_TYPE)
    return items


def get_type(key_val):
    item = get_config_item_by_id(constant.PREFIX_TYPE, key_val)
    return item


def save_type(type_id, item):

    item['PK'] = constant.PREFIX_TYPE
    item['SK'] = type_id

    response = add_config_item(item)    # Calls put_item all the time
    return response

# Vimeo  Content Type


def list_content():
    items = get_config_items_by_key(constant.PREFIX_CONTENTTYPE)
    return items


def get_content(key_val):
    item = get_config_item_by_id(constant.PREFIX_CONTENTTYPE, key_val)
    return item


def save_content(type, item):
    item['PK'] = constant.PREFIX_CONTENTTYPE
    item['SK'] = type

    response = add_config_item(item)    # Calls put_item all the time
    return response


def list_instructor():
    items = get_config_items_by_key(constant.PREFIX_INSTRUCTOR)
    return items


def get_instructor(key_val):
    item = get_config_item_by_id(constant.PREFIX_INSTRUCTOR, key_val)
    return item


def save_instructor(name, item):
    item['PK'] = constant.PREFIX_INSTRUCTOR
    item['SK'] = name

    response = add_config_item(item)    # Calls put_item all the time
    return response

def list_content_details():
    items = get_config_items_by_key(constant.PREFIX_CONTENT)
    return items

def get_content_details(id):
    item = get_config_item_by_id(constant.PREFIX_CONTENT, id)
    return item

def save_content_details(id, item):

    if not id:
        id = generate_id()
        

    item['PK'] = constant.PREFIX_CONTENT
    item['SK'] =  id

    add_config_item(item)    # Calls put_item all the time
    return item


def get_active_list(client_id, company_id):
    return _get_permission_list(client_id, company_id, False)


def get_recommendation_list (client_id, company_id):
    return _get_permission_list(client_id, company_id, True)


def _get_permission_list(client_id, company_id, is_recommended):
    list = list_content_details()
    df = pd.json_normalize(list)
    if df.empty:
       df = pd.DataFrame(
           columns=["SK", "Details.CategoryId", 'Details.IsPublished', 'Access', 'Promoted'])
    else:
        df = Util.filter_df_by_column(df, 'Details.IsPublished', True)

        # Check if Access Granted...
        df['Access'] = (df['Access.GlobalIn'] == True)
        df.loc[df['Access'] == False, 'Access'] = Util.is_valid_access_promotion(
            df, 'Access.ClientList', client_id)
        df.loc[df['Access'] == False, 'Access'] = Util.is_valid_access_promotion(
            df, 'Access.CompanyList', company_id)

        df = Util.filter_df_by_column(df, 'Access', True)
        if is_recommended:
            # Check if Promoted ...
            df['Promoted'] = (df['Promotion.GlobalIn'] == True)
            df.loc[df['Promoted'] == False, 'Promoted'] = Util.is_valid_access_promotion(
                df, 'Promotion.ClientList', client_id)
            df.loc[df['Promoted'] == False, 'Promoted'] = Util.is_valid_access_promotion(
                df, 'Promotion.CompanyList', company_id)
            df = Util.filter_df_by_column(df, 'Promoted', True)
    return df['SK'].to_list()