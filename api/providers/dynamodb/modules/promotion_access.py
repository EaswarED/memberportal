import pandas as pd
from providers.dynamodb.modules.client import get_client
from shared.helpers.api_helper import build_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key, get_config_item_by_id, update_config_item
from providers.dynamodb.modules import appt,db_class
from shared.utilities import constant

logger = get_logger(__name__)


def list(type, obj_name):
    return _list(type, obj_name)


def add(req_data, obj_name):
    class_id = req_data['classId']
    class_type = req_data['classType']
    promotion_type = req_data['promotionType']
    selected_values = Util.get_dict_data(req_data, 'selectedValues')

    item = _get(class_type, class_id)
    print(item)
    promotion_item = Util.get_dict_data(item, obj_name)
    
    column = ""
    if not promotion_item:
        promotion_item = {}
        data = []
    else:
        data = Util.get_dict_data(promotion_item, column)

    if promotion_type == constant.ACCESS_PROMOTION_GLOBAL:
        data = None
        promotion_item = {}
        column = "GlobalIn"
        selected_values = True
    else:
        promotion_item['GlobalIn'] = False
        if promotion_type == constant.ACCESS_PROMOTION_COMPANY:
            column = "CompanyList"
        elif promotion_type == constant.ACCESS_PROMOTION_USER:
            column = "ClientList"

    if data:
        promotion_data = data + selected_values
    else:
        promotion_data = selected_values

    promotion_item[column] = promotion_data

    update_expr = "SET " + obj_name + " = :" + obj_name
    update_attr = {
            ":" + obj_name: promotion_item
    }

    key = {
            'PK': Util.get_dynamodb_prefix(class_type),
            'SK': class_id,
    }
    result = _save(key, update_expr, update_attr)

    return result


def update(req_data, obj_name):
    class_id = req_data['classId']
    class_type = req_data['classType']
    promotion_type = req_data['promotionType']
    selected_id = req_data['selectedId']

    item = _get(class_type, class_id)
    promotion_item = Util.get_dict_data(item, obj_name)
    if not promotion_item:
        return None
    
    if promotion_type == constant.ACCESS_PROMOTION_GLOBAL:
        column = "GlobalIn"
        promotion_data = False
    else:
        if promotion_type == constant.ACCESS_PROMOTION_COMPANY:
                column = "CompanyList"
        elif promotion_type == constant.ACCESS_PROMOTION_USER:
                column = "ClientList"

    promotion_data = Util.get_dict_data(promotion_item, column)
    if (promotion_data and (selected_id in promotion_data)):
        promotion_data.remove(selected_id)

    promotion_item[column] = promotion_data

    update_expr = "SET " + obj_name + " = :" + obj_name
    update_attr = {
        ":" + obj_name: promotion_item
    }

    key = {
        'PK': Util.get_dynamodb_prefix(class_type),
        'SK': class_id,
    }
    result = _save(key, update_expr, update_attr)
    return result


def _list(type, obj_name):
   
    prefix = Util.get_dynamodb_prefix(type)
    if not prefix:
        return None

    items = get_config_items_by_key(prefix)  
      
    df = pd.json_normalize(items)
    columns = ['SK', 'Details.Type','Details.Name', obj_name + '.GlobalIn',
              obj_name +'.CompanyList', obj_name + '.ClientList']
    df = Util.get_df_by_column(df, columns)
    print('obbb',df)
    columns = {'Details.Name': 'Name','Details.Type': 'Type',
               obj_name + '.GlobalIn': obj_name + 'GlobalIn',
               obj_name + '.CompanyList': obj_name + 'CompanyList',
               obj_name + '.ClientList': obj_name + 'ClientList'}
    df.rename(columns=columns, inplace=True)

    if type == constant.CLASS_TYPE_APPT or type == constant.CLASS_TYPE_CONTENT:

        return Util.to_dict(df)   

    else: 
        df = Util.filter_df_by_column(df, 'Type', type)
        return Util.to_dict(df)


def _get(type, key):
    prefix = Util.get_dynamodb_prefix(type)
    item = get_config_item_by_id(prefix, key)
    return item


def _save(key, update_expr, update_attr):
    response = update_config_item(key, update_expr, update_attr)
    return response




def promo_list(req_data, obj_name):
    class_id = req_data['classId']
    class_type = req_data['classType']
    promotion_type = req_data['promotionType']
    column=""
    item = _get(class_type, class_id)
    promotion_item = Util.get_dict_data(item, obj_name)
    if not promotion_item:
        promotion_item = {}
   
    if promotion_type == constant.ACCESS_PROMOTION_COMPANY:
        column = "CompanyList"
    elif promotion_type == constant.ACCESS_PROMOTION_USER:
        column = "ClientList"

    promotion_data = Util.get_dict_data(promotion_item, column)
    print(promotion_data)
    promotion_item[column] = promotion_data

    return promotion_data


def remove_promotion(req_data, obj_name):
    class_id = req_data['classId']
    class_type = req_data['classType']
    promotion_type = req_data['promotionType']
    selected_id = req_data['selectedId']

    item = _get(class_type, class_id)
    promotion_item = Util.get_dict_data(item, obj_name)
    
    if not promotion_item:
        return None
    
    if promotion_type == constant.ACCESS_PROMOTION_COMPANY:
            column = "CompanyList"
    elif promotion_type == constant.ACCESS_PROMOTION_USER:
            column = "ClientList"
   
    promotion_data = Util.get_dict_data(promotion_item, column)
    print('ttt',promotion_data)
    
    if (promotion_data and (selected_id in promotion_data)):
            promotion_data.remove(selected_id)
    else:
        
        return 'No Selected list'
    
    promotion_item[column] = promotion_data
    print('values',promotion_item[column])
    update_expr = "SET " + obj_name + " = :" + obj_name
    update_attr = {
        ":" + obj_name: promotion_item
    }

    key = {
        'PK': Util.get_dynamodb_prefix(class_type),
        'SK': class_id,
    }
    result = _save(key,update_expr,update_attr)
    print(result)
    return result




   
