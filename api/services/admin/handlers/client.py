import json
import pandas as pd
from cerberus import Validator
from shared.helpers.api_helper import _build_response, build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.client import get_client
from providers.dynamodb.modules import client,company
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.utilities import constant

logger = get_logger(__name__)

# Get Clients Based on Lastname******
def client_search(event,context):

    searchText = Util.get_path_param(event, 'searchText')
    # searchText = 'Testdata3'
    if not searchText:
            searchText={}
    params = {'searchText': searchText}
    return  _list(params)

    

def list_users(event,context):
    params={}
    return  _list(params)


def _list(params):
    try:
        logger.debug('Retrieve client details {%s}', params)
        
        resp_data = get_client.get_view_client(params)
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.DataFrame(Util.to_lower_key(resp_data))
        if not df.empty:
            df['id'] = df['id'].astype('int64')

            columns = ['firstName','lastName','birthDate','id','country','state','email','mobilePhone','addressLine1','city','postalCode','gender','sendAccountEmails','sendAccountTexts']
        
            df = Util.get_df_by_column(df, columns)

            db_clients = client.list_client()
            dynodb_df = pd.DataFrame(db_clients)
            
            columns = ['PK','CompanyId']
            dynodb_df = Util.get_df_by_column(dynodb_df, columns)
            print(dynodb_df)

            merge_df = pd.merge (dynodb_df, df, left_on = ['PK'], right_on = ['id'],how = 'inner')
            columns = ['PK','firstName','lastName','birthDate','id','country','state','email','mobilePhone','addressLine1','city','postalCode','gender','sendAccountEmails','sendAccountTexts','CompanyId']
            merge_df = Util.get_df_by_column(merge_df, columns)

            result = company.list_company()
            dyno_df = pd.json_normalize(result)
            # dyno_df = pd.DataFrame(result)
            dyno_df.rename(columns = {'Details.Code':'Code'}, inplace = True)
            dyno_df.rename(columns = {'Details.Name':'CompanyName'}, inplace = True)
            columns=['SK','Code','CompanyName']
            dyno_df1 = Util.get_df_by_column(dyno_df,columns)
            
            print('kk',dyno_df1)

            final_df = pd.merge(dyno_df1,merge_df ,left_on = ['SK'], right_on =['CompanyId'] , how='outer')
           
            print('jjj',final_df)
            

            df1 = pd.merge(final_df,merge_df,left_on = ['id'], right_on =['id'] , how='inner')
            df1.rename(columns = {'CompanyId_x':'CompanyId'}, inplace = True)
            df1.rename(columns = {'birthDate_x':'birthDate'}, inplace = True)
            df1.rename(columns = {'country_x':'country'}, inplace = True)
            df1.rename(columns = {'firstName_x':'firstName'}, inplace = True)
            df1.rename(columns = {'lastName_x':'lastName'}, inplace = True)
            df1.rename(columns = {'state_x':'state'}, inplace = True)
            df1.rename(columns = {'email_x':'email'}, inplace = True)
            df1.rename(columns = {'mobilePhone_x':'mobilePhone'}, inplace = True)
            df1.rename(columns = {'addressLine1_x':'addressLine1'}, inplace = True)
            df1.rename(columns = {'city_x':'city'}, inplace = True)
            df1.rename(columns = {'postalCode_x':'postalCode'}, inplace = True)
            df1.rename(columns = {'gender_x':'gender'}, inplace = True)
            df1.rename(columns = {'sendAccountEmails_x':'sendAccountEmails'}, inplace = True)
            df1.rename(columns = {'sendAccountEmails_x':'sendAccountEmails'}, inplace = True)
            df1.rename(columns = {'sendAccountTexts_x':'sendAccountTexts'}, inplace = True)
            columns=['id','CompanyId','Code','CompanyName','birthDate','country','firstName','lastName','state','email','mobilePhone','addressLine1','city','postalCode','gender',
                        'sendAccountEmails','sendAccountEmails','sendAccountTexts']
            final_merged = Util.get_df_by_column(df1,columns)
            # final_merged.to_csv("C:\\SHAS\\test16.csv")   
            data_resp = Util.to_dict(final_merged)
            if data_resp:
                data_resp = data_resp
            else:
                data_resp = []

            return build_response(data_resp)
        return build_response(Util.to_dict(df))
    except SecurityException as e:
        return build_security_response([], e)                
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response({}, e)

def save_client(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        details = {
            'Name': req_data['id'],
        }

        item = {
            'Details': details,
            
        }
        result = client.save_client(req_data['id'], item)
        logger.debug(result)

        return _build_response(result, result['ResponseMetadata']['HTTPStatusCode']) 

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
