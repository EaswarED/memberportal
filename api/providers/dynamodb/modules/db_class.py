import pandas as pd
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item
from shared.utilities import constant

logger = get_logger(__name__)


def list(type=None):
    return _list(type)


def list_class():
    return _list(constant.CLASS_TYPE_CLASS)


def list_group():
    return _list(constant.CLASS_TYPE_GROUP)


def get_class(id):
    item = get_config_item_by_id(constant.PREFIX_CLASS, id)
    return item


def save_class(class_id, item):
    item['PK'] = constant.PREFIX_CLASS
    item['SK'] = class_id

    response = add_config_item(item)    # Calls put_item all the time
    return response


def get_active_list(client_id, company_id,type):
    return _get_permission_list(client_id, company_id, type, False)
    

def get_recommendation_list(client_id, company_id,type):
    return _get_permission_list(client_id, company_id, type, True)


    '''
    '' Private Functions
    '''
def _list(type):
    items = get_config_items_by_key(constant.PREFIX_CLASS)
    df = pd.json_normalize(items)
    if type:
        df = Util.filter_df_by_column(df, 'Details.Type', type)

    return df


def _get_permission_list(client_id, company_id, type, is_recommended):
    df = _list(type)
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

    return df['SK'].astype('int64').to_list()
