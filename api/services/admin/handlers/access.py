import pandas as pd
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_response, _build_response, build_empty_response, build_security_response
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from shared.utilities import constant
from providers.dynamodb.modules import promotion_access as access
from providers.dynamodb.modules import company
from providers.mindbody.modules.client import get_client
from shared.exceptions.exception import APIValidationError, SecurityException
import json

logger = get_logger(__name__)

# Get the list of Category


def list_access(event, context):
    try:
        type = Util.get_path_param(event, 'type')
        result = access.list(Util.to_upper(type), 'Access')

        return build_response(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def add_access(event, context):
    try:
        req_data = json.loads(event['body'])
        result = access.add(req_data, "Access")

        print("gggg",result)

        return _build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def update_access(event, context):
    try:
        req_data = json.loads(event['body'])
        result = access.update(req_data, "Access")

        if not result:
            build_err_response("No Access record found")

        return build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def list_access_company(event, context):
    try:
        req_data = json.loads(event['body'])
        result = access.promo_list(req_data, "Access")
        
        df = pd.DataFrame({'Company':result})
        columns=['Company']
        df = Util.get_df_by_column(df, columns) 
        df['Company'] = df['Company'].astype('int64')
        
        company_df = company.list_company()
       
        com_df=pd.json_normalize(company_df)
        columns = ['SK', 'Details.Name','Details.Email']
        com_df = Util.get_df_by_column(com_df, columns)
        com_df['SK'] = com_df['SK'].astype('int64')

        merge_df = pd.merge(df, com_df, left_on= ['Company'], right_on=['SK'], how="inner")
        data_resp = Util.to_dict(merge_df)

        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp,200)
    
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def list_access_client(event,context):
    try:
        req_data = json.loads(event['body'])
        result = access.promo_list(req_data, "Access")

        df = pd.DataFrame({'Client':result})
        print(df)
        columns=['Client']
        df = Util.get_df_by_column(df, columns) 
        df['Client'] = df['Client'].astype('int64')
        print('vt',df.dtypes)
        client_df = get_client.get_view_client({})
        resp_data = Util.get_dict_data(client_df, 'Clients')

        resp_data=pd.DataFrame(resp_data)
        columns = ['Id', 'FirstName','Email']
        resp_data = Util.get_df_by_column(resp_data, columns)
        resp_data['Id'] = resp_data['Id'].astype('int64')
        print('vt',resp_data.dtypes)
        merge_df = pd.merge(df, resp_data, left_on= ['Client'], right_on=['Id'], how="inner")
        data_resp = Util.to_dict(merge_df)

        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []

        return build_response(data_resp,200)
    
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def remove_access_list(event, context):
    try:
        req_data = json.loads(event['body'])
        result = access.remove_promotion(req_data, "Access")
        
        if not result:
            build_err_response("No access company record found")

        return build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
