import pandas as pd
import numpy as np
import json
from shared.helpers.api_helper import build_custom_err_response, build_empty_response, build_err_response, build_response, _build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from cerberus import Validator
from shared.helpers import session_helper
from providers.dynamodb.modules import appt, category
from providers.mindbody.modules.site import program, session_type
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)

def list_appt(event, context):
    try:
        # Appt Session Types
        appt_df = session_type.get_session_type_appt_df()

        result = appt.list_appt()

        dynodb_df = pd.json_normalize(result)
        # Added Check to check if valid Dataframe exists
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')

        print(dynodb_df)
        # Merge Data
        merge_df = pd.merge(appt_df, dynodb_df, left_on=[
            'SessionTypeId'], right_on=['SK'], how="left")
        print(merge_df)
        # Dynamo DB - Category
        result = category.list_category()
        category_df = pd.json_normalize(result)
        
        # Added Check to check if valid Dataframe exists
        if category_df.empty:
            category_df = pd.DataFrame(columns=["CategoryId"])

        columns = {'SK': 'CategoryId', 'Details.Name': 'CategoryName'}
        category_df.rename(columns=columns, inplace=True)
        category_df['CategoryId'] = category_df['CategoryId'].apply(str)

        # Merge w/Category
        merge_df['Details.CategoryId'] = merge_df['Details.CategoryId'].apply(str)
        final_df = Util.get_df_by_column(merge_df, columns)

        final_df = pd.merge(merge_df, category_df, left_on=[
            "Details.CategoryId"], right_on=["CategoryId"], how="left")
        final_df.rename(
            columns={'Details.ImageUrl_x': 'Details.ImageUrl'}, inplace=True)
        final_df.rename(
            columns={'Details.Description_x': 'Details.Description'}, inplace=True)
        columns = ['SessionTypeId', 'SessionName', 'SK', 'Details.Name', 'CategoryId',
                'CategoryName', 'Details.IsPublished', 'Promotion.GlobalIn', 'Access.GlobalIn', 'Details.ImageUrl', 'Details.Description']
        final_df = Util.get_df_by_column(final_df, columns)
        

        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
            return build_security_response({}, e)
    except APIValidationError as e:
            return build_custom_err_response({}, e)
    except Exception as e:
            return build_err_response({}, e)

    



def save_appt(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)

        appt_id = req_data['id']

        item = appt.get_appt(appt_id)
        if not item:
            item = {}
        details = {
            'IsPublished': req_data['isPublished'],
            'Name': req_data['name'],
            'CategoryId': req_data['categoryId'],
            'Description': req_data['description'],
            'ImageUrl': req_data['imageUrl']
        }

        item['Details'] = details
        item['FormsList'] = Util.get_dict_data(req_data, 'formsList')

        result = appt.save_appt(appt_id, item)
        logger.debug(result)

        return _build_response(result, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def get_appt(event, context):
    try:
        appt_id = Util.get_path_param(event, 'id')

        if not appt_id:
            return build_empty_response()

        result = appt.get_appt(appt_id)

        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
