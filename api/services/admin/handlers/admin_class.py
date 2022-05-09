import json
import numpy as np
import pandas as pd
# from pandas.core.indexes import category
from shared.helpers import session_helper
from cerberus import Validator
from shared.helpers.api_helper import _build_response, build_custom_err_response, build_empty_response, build_err_response, build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.dynamodb.modules import db_class,  category
from providers.mindbody.modules.classes import class_description
from providers.mindbody.modules.client import get_client
from shared.exceptions.exception import APIValidationError, SecurityException


logger = get_logger(__name__)


def list_class(event, context):
    return _list(constant.CLASS_TYPE_CLASS,event)


def list_group(event, context):
    return _list(constant.CLASS_TYPE_GROUP,event)
    

def get(event, context):
    try:
        id = Util.get_path_param(event, 'id')

        if not id:
            return build_empty_response()

        result = db_class.get_class(id)

        return build_response(result)

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


# Dynamodb save Class


def save(event, context):

    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)

        class_id = req_data['id']

        item = db_class.get_class(class_id)

        if not item:
            item = {}

        details = {
            'IsPublished': req_data['isPublished'],
            'Name': req_data['name'],
            'CategoryId': req_data['categoryId'],
            'Type': req_data['type'],
            'GroupType': req_data['gtype'],
            'IsOpen': req_data['isOpen'],
          
        }
        if req_data['type'] =='C':
            details['ZoomUrl']=req_data['zoomUrl']

        item['Details'] = details
        item['FormsList'] = Util.get_dict_data(req_data, 'formsList')
        print( item['FormsList'])
        if not item['FormsList']:
            item['FormsList'] =[]
        result = db_class.save_class(class_id, item)
        logger.debug(result)

        return build_response(result, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


# Private Functions


def _list(type,event):
    try:
        # class from Mindbody
       
        params = {}
        logger.debug('Retrieve Classes for Parameters {%s}', params)


        # Get All Classes From Dynamo DB
        dynodb_df = db_class.list()
        
        # Added Check to check if valid Dataframe exists
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')

       
        columns = {'Details.Type','Details.CategoryId', 'Details.IsPublished',
                   'Details.Name', 'SK', 'Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn'}
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')
        
        # Identify Group/Class
        if (type == constant.CLASS_TYPE_CLASS):
            df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', constant.CLASS_TYPE_GROUP)
        else:
            df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', constant.CLASS_TYPE_CLASS)
        exclude_ids = df['SK'].astype('int64').to_list()

        # Seperate Class/Group
        dynodb_df = Util.filter_df_by_column(
            dynodb_df, 'Details.Type', type)

        # Retrieve All Mindbody Classes
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        class_df = pd.json_normalize(data)
        columns = {'Id', 'SessionType.Id', 'Name',
                   'Description', 'ImageURL'}
        class_df = Util.get_df_by_column(class_df, columns)

        # Filter Class/Groups
        class_df = Util.filter_df(class_df, exclude_ids, 'Id', False)

        merge_df = pd.merge(class_df, dynodb_df, left_on=[
            'Id'], right_on=['SK'], how="outer")
        columns = {'Details.CategoryId', 'Details.IsPublished','Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn',
                   'Details.Name', 'SK', 'Description', 'Name', 'Id', 'Details.Type', 'ImageURL'}
        merge_df = Util.get_df_by_column(merge_df, columns)
       
        
        # Dynamo DB - Category
        result = category.list_category()
        category_df = pd.json_normalize(result)
        if category_df.empty:
            category_df = pd.DataFrame(columns=["CategoryId"])
        columns = {'SK': 'CategoryId', 'Details.Name': 'CategoryName'}
        category_df.rename(columns=columns, inplace=True)

        # Merge w/Category
        final_df = pd.merge(merge_df, category_df, left_on=[
            "Details.CategoryId"], right_on=["CategoryId"], how="left")
        final_df.rename(columns = {'Details.Type_x':'Details.Type'},inplace=True)
        columns = ['SK', 'Details.Name', 'CategoryId', 'CategoryName','Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn',
                   'Details.IsPublished', 'Id', 'Name', 'Description', 'Details.Type', 'ImageURL']
        final_df["Name"] = final_df["Name"].fillna(final_df["Details.Name"])
        final_df['Details.IsPublished'] = final_df['Details.IsPublished'].replace(
            np.nan, False)
        final_df = final_df.replace(np.nan, "")
        final_df = Util.get_df_by_column(final_df, columns)
       

        return build_response(Util.to_dict(final_df))

        
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)




