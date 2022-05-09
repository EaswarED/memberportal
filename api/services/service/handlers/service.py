import numpy as np
import pandas as pd
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.helpers import session_helper
from providers.mindbody.modules.sale import service
from providers.mindbody.modules.client import client_member
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)

def list_service_appt(event,context):
    # sessiontype_id = '23'
    sessiontype_id=Util.get_path_param(event, 'id')
    client_id = session_helper.get_client_id(event)
    params = {'sessiontypeIds':sessiontype_id} 

    df, df2 = list_services(params,client_id)
    
    final_df = pd.merge(df,df2,left_on =['MembershipId','ServiceName'], right_on=['MembershipId','Name'], how = 'inner')
    columns = ['Count','Price','Remaining','Name','MembershipId','Type','ServiceName','ServiceId']
    final_df1 = Util.get_df_by_column(final_df, columns)
    print('fff',final_df)
    return build_response(Util.to_dict(final_df1))
 

def list_service_class(event,context):
    # class_id ='340'

    class_id=Util.get_path_param(event, 'id')
    client_id = session_helper.get_client_id(event)
    params = {'ClassId':class_id}  
    df, df2 = list_services(params,client_id)
    
    final_df = pd.merge(df,df2,left_on ='MembershipId', right_on='MembershipId', how = 'left')
    columns = ['Count','Price','Remaining','Name','MembershipId','Type','ServiceName','ServiceId']
    final_df1 = Util.get_df_by_column(final_df, columns)

    return build_response(Util.to_dict(final_df1))


def list_services(params,client_id):
    try:  
        
        logger.debug('Retrieve services {%s}', params) 

        resp_data = service.get_services_list(params)
        data = Util.get_dict_data(resp_data, 'Services')
        df = pd.json_normalize(data) 
        df.rename (columns={'Id':'ServiceId'},inplace=True)
        df.rename (columns={'Name':'ServiceName'},inplace=True)
        df['ServiceId'] = df['ServiceId'].astype('int64')
        columns = ['ServiceId','ProductId','Remaining','ServiceName','MembershipId','Price']              
        df = Util.get_df_by_column(df, columns)

        df['MembershipId'] =  df['MembershipId'].replace(
             np.nan, 0)
        df['MembershipId'] = df['MembershipId'].astype('int64')
        # df['ServiceId'] = df['ServiceId'].astype('int64')
        print(df.dtypes)
        
        print('iii',df)

        client_df = client_member.view_client_membership(params={'clientId': client_id})
        data = Util.get_dict_data( client_df, 'ClientMemberships')
        
        member_df = pd.DataFrame(data) 
        member_df['MembershipId']= member_df['MembershipId'].astype('int64')
        member_df.rename (columns={'Name':'Name'},inplace=True)
        columns = ['MembershipId','Count','Name','Price']              
        member_df = Util.get_df_by_column(member_df, columns)
        member_df = member_df.drop_duplicates(
            subset=['Name'], keep='last')
        print('ll',member_df)
        return df,member_df


    except SecurityException as e:
        return build_security_response({}, e)  
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)        
         


