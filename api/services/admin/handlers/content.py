import json
import pandas as pd
import boto3
import base64
from shared.helpers import session_helper
from shared.helpers.api_helper import _build_response,  build_custom_err_response, build_empty_response, build_err_response, build_response, build_security_response
from shared.helpers.env_helper import get_env_value
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.dynamodb.modules import self_care, category
from providers.vimeo.modules import appearance
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.vimeo.modules import appearance

logger = get_logger(__name__)


def list_content(event, context):
    try:
        
        params = {'per_page':10}
        logger.debug(
            'Retrieve Videos user can view for the Params {%s}', params)

        resp_data = appearance.get_video_list(params)
        data = Util.get_dict_data(resp_data, 'data')
        vimeo_df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['uri', 'name', 'description', 'type',
                   'link', 'duration', 'width', 'height']
        vimeo_df = Util.get_df_by_column(vimeo_df, columns)

        vimeo_df['id'] = vimeo_df['uri'].str.split('/').str[2]
        vimeo_df['id'] = vimeo_df['id'].apply(str)

        # DB Content
        result = self_care.list_content_details()
        print(result)
        dynodb_df = pd.json_normalize(result)
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        dynodb_df['SK'] = dynodb_df['SK'].apply(str)
   
        # Merge Data
        merge_df = pd.merge(vimeo_df, dynodb_df, left_on=[
            'id'], right_on=['SK'], how="outer")
        print(merge_df)
        # merge_df.to_csv("C:\SHAS\\test1.csv")
    
        
        merge_df["Name"] = merge_df["name"].fillna(merge_df["Details.Name"])
        merge_df["Description"] = merge_df["description"].fillna(
            merge_df["Details.Description"])
        merge_df["ContentType"] = merge_df["Details.Type"].fillna(
           "V")
        merge_df.drop(
            ['name', 'description', 'Details.Name', 'Details.Description', 'PK','type'], axis=1, inplace=True)
        
        # Dynamo DB - Category
        result = category.list_category()
        category_df = pd.json_normalize(result)
        if category_df.empty:
            category_df = pd.DataFrame(columns=["CategoryId"])

        columns = {'SK': 'CategoryId', 'Details.Name': 'CategoryName'}
        category_df.rename(columns=columns, inplace=True)
        category_df['CategoryId'] = category_df['CategoryId'].apply(str)
        columns = ['CategoryId', 'CategoryName']
        category_df = Util.get_df_by_column(category_df, columns)

        # Merge w/Category
        merge_df['Details.CategoryId'] = merge_df['Details.CategoryId'].apply(
            str)
        final_df = pd.merge(merge_df, category_df, left_on=[
            "Details.CategoryId"], right_on=["CategoryId"], how="left")
        print('final',final_df)
        
        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def get_content(event, context):
    try:
        # content_id = '662717165'
        content_id = Util.get_path_param(event, 'id')
        
        if not id:
            return build_empty_response()     
        result = self_care.get_content_details(content_id)

        return build_response(result) 

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def save_content(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        
        
        details = {
            'IsPublished': req_data['isPublished'],
            'Name': req_data['name'],
            'CategoryId': req_data['categoryId'],
            'Description': req_data['description'],
            'Type': req_data['type']
        }
        item = {
            'Details': details
        }
        result = self_care.save_content_details(req_data['id'], item)
        logger.debug(result)

        return _build_response(result, 200)
  
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

# List of Content type


def type_list(event, context):
    try:
        resp_data = self_care.list_content()
        resp_data = pd.json_normalize(Util.to_lower_key(resp_data))
        if resp_data .empty:
            resp_data  = pd.DataFrame(columns=["sK"])

        content_rename = {'sK': 'code',
                          'details.Name': 'name', 'details.Type': 'type'}
        resp_data.rename(columns=content_rename, inplace=True)
        columns = ['code', 'name', 'type']
        resp_data = Util.get_df_by_column(resp_data, columns)

        return build_response(Util.to_dict(resp_data))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def upload_content(event, context):
    req_data = json.loads(event['body'])
    print(req_data)
    
    bucket_name = get_env_value('BUCKET_NAME_CONTENT')
    content_id = req_data['id']
    data = req_data['data']
    type = req_data['type'] # pdf or html

    key = content_id + "." + type
    s3 = boto3.resource('s3')
    object = s3.Object(bucket_name, key)

    if type != constant.CONTENT_TYPE_HTML:
        data = str.encode(data)

    object.put(Body=data)

    # Save in Dynamo DB
    item = self_care.get_content_details(content_id)
    details = item['Details']
    details['FileName'] = key

    item['Details'] = details
    result = self_care.save_content_details(content_id, item)

    return _build_response(result, 200)

def read_content(event, context):
    # content_id = 'S01'
    content_id = Util.get_path_param(event, 'id')

    bucket_name = get_env_value('BUCKET_NAME_CONTENT')

    item = self_care.get_content_details(content_id)
    key = item['Details']['FileName']
    print('kk',key)

    s3 = boto3.client('s3')
    file_content = s3.get_object(
        Bucket=bucket_name, Key=key)["Body"].read()
    print('ss',s3, file_content)

    if key.endswith('.pdf'):
        file_content = file_content.decode("utf-8")

    result = {
        
        'data': file_content,
        'fileDetails':key
    }
    print(result)
    return build_response((result))
