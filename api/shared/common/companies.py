import json
import pandas as pd
import numpy as np
from cerberus import Validator
from shared.helpers.api_helper import build_custom_err_response,  build_err_response, build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.dynamodb.modules import company
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.mindbody.modules.client import get_client



def register_company(event,context):
    try:
        # Get Company
        resp_data = get_client.get_view_client({})
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.DataFrame(resp_data)
        columns = ['LastName','FirstName','Id','Country','State','Email','MobilePhone','AddressLine1','City','PostalCode','IsCompany']      
        df = Util.get_df_by_column(df, columns)      
        df = Util.filter_df_by_column(df, 'IsCompany', True)
        
        result = company.list_company()
        dynodb_df = pd.json_normalize(result)
        
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK"])

        # Merge Data
        merge_df = pd.merge(df, dynodb_df, left_on=[
            'Id'], right_on=['SK'], how="inner")
        merge_df["Name"] = merge_df["LastName"].fillna(merge_df["Details.Name"])
        merge_df["Email"] = merge_df["Email"].fillna(merge_df["Details.Email"])
        
        return build_response(Util.to_dict(merge_df ))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)