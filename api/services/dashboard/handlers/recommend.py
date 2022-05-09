import json

import pandas as pd
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.mindbody.modules.client import client_visit
from providers.mindbody.modules.classes import class_description
from providers.dynamodb.modules import appt, db_class
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.helpers import session_helper

logger = get_logger(__name__)


def get_data(event, context):
    json_file = 'data/content'
    # if event:
    #     json_file = event['path']

    json_file = json_file + ".json"

    with open(json_file, 'r') as file_obj:
        json_data = json.load(file_obj)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(json_data),
    }


def list_recommended_appt(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)

        params = {
            'clientId': client_id,
            'endDate': Util.get_default_end_date()
        }
        logger.debug('Retrieve Visits name for Parameters {%s}', params)

        # Client Booked Appointment / Class
        resp_data = client_visit.get_client_visit(params)
        data = Util.get_dict_data(resp_data, 'Visits')
     
        if len(data) == 0:
            visit_df = pd.DataFrame()
            visit_df['VisitType'] = ''
            
        else:
            visit_df = pd.DataFrame(data)
            columns = ['VisitType','AppointmentId','ClassId','StartDateTime','AppointmentStatus','SignedIn','MakeUp']
            visit_df = Util.get_df_by_column(visit_df, columns)
        
        result = appt.list_appt()
        print(result)
        dynodb_df = pd.json_normalize(result)
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])
        columns = {'SK': 'Id', 'Details.Name': 'Name',
                   'Details.CategoryId': 'CategoryId'}
        dynodb_df.rename(columns=columns, inplace=True)
        
        columns = ['Id', 'Name', 'CategoryId']
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        dynodb_df['Id'] = dynodb_df['Id'].astype('int64')
        #dynodb_df = dynodb_df[~dynodb_df['Id'].isin(
            #visit_df['VisitType'])]
        merge_df = pd.merge (dynodb_df, visit_df, left_on=[
            "Id"], right_on=["VisitType"], how="left")
        columns = ['AppointmentId','StartDateTime','Id', 'Name', 'CategoryId','AppointmentStatus','SignedIn','MakeUp']
        final_df= Util.get_df_by_column(merge_df, columns)
        print('final_df',final_df)
        
        appt_ids = appt.get_recommendation_list(client_id, company_id)
        final_df1 = Util.filter_df_by_list(
            final_df, 'Id', appt_ids)
        final_df1.rename(columns={'AppointmentId': 'BookingId'}, inplace=True)
        print('ty',final_df1)
        
        return build_response(Util.to_dict(final_df1))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)

def list_recommended_class(event, context):
    return _list_session_type(event, constant.CLASS_TYPE_CLASS)


def list_recommended_group(event, context):
    return _list_session_type(event, constant.CLASS_TYPE_GROUP)


def _list_session_type(event,type):
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        params = {
            'clientId': client_id,
            'endDate': Util.get_default_end_date()
        }

        logger.debug('Retrieve client visit for Classes {%s}', params)

        resp = client_visit.get_client_visit(params)
        data = Util.get_dict_data(resp, 'Visits')

        if len(data) > 0:
            visit_df = pd.DataFrame(data)
            visit_df = visit_df[visit_df['ClassId'] > 0]
            visit_df.rename(columns={'Name': 'ClassName'}, inplace=True)
            visit_df.rename(columns={'ClassId': 'BookingId'}, inplace=True)
            visit_df.rename(columns={'Id': 'VisitId'}, inplace=True)
            columns = ['BookingId', 'ClassName', 'StaffName', 'VisitType',
                       'StartDateTime', 'StaffId','AppointmentStatus','VisitId','SignedIn','MakeUp']
            visit_df = Util.get_df_by_column(visit_df, columns)
            visit_df = visit_df[visit_df['BookingId'] > 0]

        else:
            visit_df = pd.DataFrame()
            visit_df['VisitType'] = ''
            visit_df['ClassName'] = ''

        # Retrieve All Mindbody Classes
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        class_df = pd.json_normalize(data)
        class_df.rename(
            columns={'SessionType.Id': 'SessionTypeId'}, inplace=True)

        columns = {'Id', 'SessionTypeId', 'Name',
                   'Description', 'ImageURL'}
        class_df = Util.get_df_by_column(class_df, columns)

        final_df = pd.merge(class_df, visit_df, left_on=[
            'SessionTypeId', 'Name'], right_on=['VisitType', 'ClassName'], how="outer")

        # DB
        published_ids = db_class.get_recommendation_list(client_id,company_id,type)
        print('pp',published_ids)

        # Filter Published Class/Groups
        final_df = Util.filter_df(final_df, published_ids, 'Id')

        columns = ['BookingId', 'Name', 'StaffName', 'SessionTypeId',
                   'StartDateTime', 'StaffId', 'Id', 'AppointmentStatus','VisitId','SignedIn','MakeUp']
        final_df = Util.get_df_by_column(final_df, columns)


        if type == constant.CLASS_TYPE_CLASS:
            result = db_class.list_class()
        else:
            result = db_class.list_group()
    
        dynodb_df = pd.DataFrame(result)
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        print(dynodb_df)
        if type != constant.CLASS_TYPE_CLASS:
            pattern = str(client_id) + '#'
            dynodb_df['Approved'] = dynodb_df['Approved'].apply(
                lambda d: d if isinstance(d, list) else [])
            dynodb_df['Pending'] = dynodb_df['Pending'].apply(
                lambda d: d if isinstance(d, list) else [])
            dynodb_df['IsApproved'] = dynodb_df.Approved.apply(
                lambda list: any(pattern in s for s in list))
            dynodb_df['IsPending'] = dynodb_df.Pending.apply(
                lambda list: any(pattern in s for s in list))
            dynodb_df.loc[dynodb_df['Details.IsOpen'] == True,
                      'IsApproved'] = True  
        columns = {'SK': 'DescriptionId', 'Details.Name': 'Names',
                   'Details.CategoryId': 'CategoryId'}
        dynodb_df.rename(columns=columns, inplace=True)

        columns = ['DescriptionId', 'Names', 'CategoryId', 'IsApproved', 'IsPending']
        dynodb_df['DescriptionId'] = dynodb_df['DescriptionId'].astype('int64')
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        

        
        merge_df = pd.merge (final_df, dynodb_df, left_on=[
            "Id"], right_on=["DescriptionId"], how="left")
                   
        columns = ['BookingId', 'VisitId','Name', 'StaffName', 'SessionTypeId','DescriptionId','SignedIn','MakeUp',
                   'StartDateTime', 'StaffId', 'DescriptionId', 'CategoryId','AppointmentStatus','IsApproved', 'IsPending']
       
        merge_df= Util.get_df_by_column(merge_df, columns)
        

        return build_response(Util.to_dict(merge_df))
        
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
