import pandas as pd
import numpy as np
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, add_config_item, update_config_item
from shared.utilities import constant

logger = get_logger(__name__)


def list_appt():
    items = get_config_items_by_key(constant.PREFIX_APPT)
    return items


def get_appt(id):
    item = get_config_item_by_id(constant.PREFIX_APPT, id)
    return item


def save_appt(key_val, item):
    item['PK'] = constant.PREFIX_APPT
    item['SK'] = key_val

    response = add_config_item(item)    # Calls put_item all the time
    return response


def get_active_list(client_id, company_id):
    return _get_permission_list(client_id, company_id, False)


def get_recommendation_list (client_id, company_id):
    return _get_permission_list(client_id, company_id, True)


def _get_permission_list(client_id, company_id, is_recommended):
    list = list_appt()
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

    return df['SK'].astype('int64').to_list()
