
import pandas as pd
from providers.dynamodb.helpers.dynamodb_helper import get_config_items_by_key
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_mindbody_response, build_response, _build_response, build_empty_response, build_security_response
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from shared.utilities import constant
from providers.dynamodb.modules import promotion_access as promotion
from providers.dynamodb.modules.promotion_access import _get
from providers.mindbody.modules.client import get_client
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
import json
from providers.dynamodb.modules import company,db_class,self_care

logger = get_logger(__name__)

# Get the list of Category


def list_promotions(event, context):
    try:
        type = Util.get_path_param(event, 'type')
        result = promotion.list(Util.to_upper(type), 'Promotion')

        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def add_promotion(event, context):
    try:
        req_data = json.loads(event['body'])
        result = promotion.add(req_data, "Promotion")
        print(result)
        return build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def update_promotion(event, context):
    try:
        req_data = json.loads(event['body'])
        result = promotion.update(req_data, "Promotion")

        if not result:
            build_err_response("No promotion record found")

        return build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)



def list_promo_company(event, context):
    try:
        req_data = json.loads(event['body'])
        result = promotion.promo_list(req_data, "Promotion")
    
        df = pd.DataFrame({'Company':result})
        columns = ['Company']
        df = Util.get_df_by_column(df, columns) 
        company_df = company.list_company()
        com_df=pd.json_normalize(company_df)
        columns = ['SK', 'Details.Name','Details.Email']
        com_df = Util.get_df_by_column(com_df, columns)
        print(com_df.dtypes)
        merge_df = pd.merge(df, com_df, left_on= ['Company'], right_on=['SK'], how="inner")
        data_resp = Util.to_dict(merge_df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp,200)
    
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)

def list_promo_client(event,context):
    try:
        req_data = json.loads(event['body'])
        result = promotion.promo_list(req_data, "Promotion")
        
        df = pd.DataFrame({'Client':result})
        columns=['Client']
        df = Util.get_df_by_column(df, columns) 
        df['Client'] = df['Client'].astype('int64')
        client_df = get_client.get_view_client({})
        resp_data = Util.get_dict_data(client_df, 'Clients')
        resp_data = pd.DataFrame(resp_data)
        resp_data['Id'] = resp_data['Id'].astype('int64')
        columns = ['Id', 'FirstName','Email']
        resp_data = Util.get_df_by_column(resp_data, columns)
        
        merge_df = pd.merge(df, resp_data, left_on= ['Client'], right_on=['Id'], how="inner")
        data_resp = Util.to_dict(merge_df)

        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp,200)
    
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)

def remove_promo_list(event, context):
    try:
        req_data = json.loads(event['body'])
        result = promotion.remove_promotion(req_data, "Promotion")
        
        if not result:
            build_err_response("No promotion company record found")

        return build_response(result, 200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
