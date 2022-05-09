import json
from logging import Formatter
import pandas as pd
from shared.helpers.api_helper import build_custom_err_response, build_empty_response, build_err_response, build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.dynamodb.modules import form as dfm
from providers.jotform.modules import forms as jfm
from providers.dynamodb.modules import form
from providers.drchrono.modules.patient import template
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)


def list_form(event,context):
    try:
        print(event)
        type = Util.get_path_param(event, 'type')
        params = {}
        if Util.to_upper(type) == constant.FORM_CLINICAL:#clinical
            result = form.list_form(Util.to_upper(type))
            df = pd.json_normalize(result)
            print(df)
            
            df.rename( columns={'Details.Name':'Name'}, inplace=True)
            columns = ['SK','Name','Details.Validity']
            df = Util.get_df_by_column(df, columns)
            print(df)
            return build_response(Util.to_dict(df))
        else:#jotform
            resp_data = jfm.get_user_forms(params)
            data = Util.get_dict_data(resp_data, 'content')  
            df = pd.json_normalize(data)
            df.rename( columns={'id':'SK'}, inplace=True)
            columns = ['SK','title','url']
        
        df['SK'] = df['SK'].apply(str)
        df = Util.get_df_by_column(df, columns)
        
        result = dfm.list_form(Util.to_upper(type))
        dynodb_df = pd.json_normalize(result)
        columns = {'Details.Validity', 'Details.Name','SK','PK'}         
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        
        #Merge
        final_df = pd.merge(df, dynodb_df, left_on=[
        "SK"], right_on=["SK"], how="outer")
        final_df["Name"] = final_df["title"].fillna(final_df["Details.Name"])


        return build_response(Util.to_dict(final_df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def save_form(event, context):
    try:
        req_data = json.loads(event['body'])

        form_type = Util.get_dict_data(req_data, 'formType')
        id = Util.get_dict_data(req_data, 'id')

        logger.debug('Request Body: %s', req_data)
        dtl_obj = {
            'Name': req_data['name'],
            'Validity': req_data['validity']
        }
        item = {
            'Details': dtl_obj
        }
        result = dfm.save_form(Util.to_upper(form_type), id, item)
        return build_response(result, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def get_clinical_form(event, context):
    return _get_form(event, context, constant.FORM_CLINICAL)


def get_non_clinical_form(event, context):
    return _get_form(event, context, constant.FORM_NON_CLINICAL)


def _get_form(event, context,type):
    try:
        id = Util.get_path_param(event, 'id')

        if not id:
            return build_empty_response()

        result = form.get_form(type, id)
        
        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)