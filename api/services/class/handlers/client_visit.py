from multiprocessing.sharedctypes import Value
import numpy as np
import pandas as pd
from shared.helpers.api_helper import  build_response, build_custom_err_response, build_err_response, build_security_response
from shared.helpers.shared_actions import get_cancel_detail
from shared.utilities.logger import get_logger
from shared.utilities import constant
from shared.utilities.Util import Util
from providers.mindbody.modules.client import client_visit
from providers.mindbody.modules.staff import staff
from providers.dynamodb.modules import db_class,client
from providers.mindbody.modules.classes import classes, class_description
from providers.mindbody.modules.site import session_type
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException


logger = get_logger(__name__)


def class_visits(event, context):
    return _visits(event, constant.CLASS_TYPE_CLASS)


def group_visits(event, context):
    return _visits(event, constant.CLASS_TYPE_GROUP)


def list_class_detail(event, context):
    try:
        classdescription_id = Util.get_path_param(event, 'id')
        params = {'ClassDescriptionIds': classdescription_id,
                  'endDateTime': Util.get_default_end_date()}
        logger.debug('Retrieve Classes for Parameters {%s}', params)

        resp_data = classes.get_class_list(params)

        data_array = Util.get_dict_data(resp_data, "Classes")
        df = pd.json_normalize(data_array)
        data = Util.to_split_datetimeformat(data_array, 'StartDateTime')
        df['startDate'] = data['startDate']
        df['time'] = data['Time']
        df['startisAM'] = data['startisAM']
        columns = ['Id', 'ClassDescription.Id', 'ClassDescription.Name', 'Location.Id','ClassDescription.SessionType.Id', 'startDate',
                   'time', 'startisAM', 'ClassScheduleId', 'MaxCapacity', 'WebCapacity', 'TotalBooked', 'TotalBookedWaitlist']
        df = Util.get_df_by_column(df, columns)

        data_resp = Util.to_dict(df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp)

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def _visits(event, type):
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
            columns = ['BookingId', 'VisitId', 'ClassName', 'StartDateTime',
                       'EndDateTime', 'VisitType', 'AppointmentStatus', 'StaffId','SignedIn','MakeUp','ClientId']
            visit_df = Util.get_df_by_column(visit_df, columns)
           
            # Staff
            staff_df = staff.get_staff_df()

            # Staff Merging
            merged_df = pd.merge(staff_df, visit_df, left_on=[
                "StaffId"], right_on=["StaffId"], how='inner')
            columns = ['BookingId','VisitId', 'ClassName', 'StaffName', 'VisitType',
                       'StartDateTime', 'StaffId','AppointmentStatus','SignedIn','MakeUp','ClientId']
            merged_df = Util.get_df_by_column(merged_df, columns)
            print('mm',merged_df)

        else:
            merged_df = pd.DataFrame()
            merged_df['VisitType'] = ''
            merged_df['ClassName'] = ''
            merged_df['ClientId'] = ''
        # Session
        session_df = session_type.get_session_type_df()

        # Merging of Visit & Session
        merg_df = pd.merge(merged_df, session_df, left_on=[
                             "VisitType"], right_on=["SessionTypeId"], how="inner")
        merg_df['ClientId'] = merg_df['ClientId'].astype('int64') 
        print('data',merg_df.dtypes)

        dyn_data = client.get_client(client_id)
        dyn_df = pd.json_normalize(dyn_data)
        dyn_df['PK'] = dyn_df['PK'].astype('int64')
        merge_visit_df = pd.merge(dyn_df, merg_df, left_on=[
                                  'PK'], right_on=['ClientId'], how='inner')
        print('merge',merge_visit_df)
       
        columns =['BookingId','VisitId', 'ClassName', 'StaffName', 'VisitType',
                       'StartDateTime', 'StaffId','AppointmentStatus','SignedIn','MakeUp','ClientId','Freebie']
        merge_visit_df = Util.get_df_by_column( merge_visit_df,columns) 

        # Retrieve All Mindbody Classes
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        class_df = pd.json_normalize(data)
        class_df.rename(
            columns={'SessionType.Id': 'SessionTypeId'}, inplace=True)
       
        columns = {'Id', 'SessionTypeId', 'Name',
                   'Description', 'ImageURL'}
        class_df = Util.get_df_by_column(class_df, columns)

        final_df = pd.merge(class_df, merge_visit_df, left_on=[
            'SessionTypeId', 'Name'], right_on=['VisitType', 'ClassName'], how="outer")

        # DB
        published_ids = db_class.get_recommendation_list(client_id, company_id,type)
        print('publish',published_ids)

        # Filter Published Class/Groups
        final_df = Util.filter_df(final_df, published_ids, 'Id')

        columns = ['BookingId', 'Name', 'StaffName', 'SessionTypeId','VisitId','ClientId','Freebie',
                   'StartDateTime', 'StaffId', 'Id', 'AppointmentStatus','Type','SignedIn','MakeUp']
        final_df = Util.get_df_by_column(final_df, columns)
        print('publish_final',final_df)

        if type == constant.CLASS_TYPE_CLASS:
            result = db_class.list_class()
        else:
            result = db_class.list_group()
    
        dynodb_df = pd.DataFrame(result)
        if dynodb_df .empty:
                 dynodb_df  = pd.DataFrame(columns=["SK"])

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
        dynodb_df['DescriptionId'] = dynodb_df['DescriptionId'].astype('int64')
        columns = ['DescriptionId', 'Names', 'CategoryId', 'IsApproved', 'IsPending']
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        print('yyyy',dynodb_df)

        merge_df = pd.merge (final_df, dynodb_df, left_on=[
            "Id"], right_on=["DescriptionId"], how="left")
                   
        columns = ['BookingId', 'Name', 'StaffName', 'SessionTypeId','Type','VisitId','ClientId','Freebie',
                   'StartDateTime', 'StaffId', 'DescriptionId', 'CategoryId','AppointmentStatus','IsApproved', 'IsPending','SignedIn','MakeUp']
        
        merge_df= Util.get_df_by_column(merge_df, columns)

        return build_response(Util.to_dict(merge_df))
        
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


def create_class(event, context):
    return _list(event,constant.CLASS_TYPE_CLASS)

def create_group(event, context):
    return _list(event,constant.CLASS_TYPE_GROUP)


# def _list(event,type):

    
#     try:
#         client_id = session_helper.get_client_id(event)
#         company_id = session_helper.get_company_id(event)
#         if not client_id:
#             raise APIValidationError(
#                 'API Request is incomplete. Client_Id is required')

#         params = {
#             'clientId': client_id,
#             'endDate': Util.get_default_end_date()
#         }

#         logger.debug('Retrieve client visit for Classes {%s}', params)

#         resp = client_visit.get_client_visit(params)
#         data = Util.get_dict_data(resp, 'Visits')

#         if len(data) > 0:
#             visit_df = pd.DataFrame(data)
#             visit_df = visit_df[visit_df['ClassId'] > 0]
#             visit_df.rename(columns={'Name': 'ClassName'}, inplace=True)
#             visit_df.rename(columns={'ClassId': 'BookingId'}, inplace=True)
#             columns = ['BookingId', 'Id', 'ClassName', 'StartDateTime',
#                        'EndDateTime', 'VisitType', 'AppointmentStatus', 'StaffId']
#             visit_df = Util.get_df_by_column(visit_df, columns)
#             print('ll',visit_df)
#             # visit_df.loc[visit_df['AppointmentStatus'] == 'Cancelled', 'StartDateTime'] = ""

#         else:
#             visit_df = pd.DataFrame()
#             visit_df['VisitType'] = ''
#             visit_df['ClassName'] = ''   
        
#         resp_data = class_description.get_class_description(params)
#         data = Util.get_dict_data(resp_data, "ClassDescriptions")
#         class_df = pd.json_normalize(data)
#         class_df.rename(
#             columns={'SessionType.Id': 'SessionTypeId'}, inplace=True)
#         class_df.rename(
#             columns={'Id': 'DescriptionId'}, inplace=True)
#         columns = {'DescriptionId', 'SessionTypeId', 'Name'
#                    }
#         class_df = Util.get_df_by_column(class_df, columns)

#         final_df = pd.merge(class_df, visit_df, left_on=[
#             'SessionTypeId', 'Name'], right_on=['VisitType', 'ClassName'], how="outer")
        
#         print('vv',final_df)
#         # DB
#         published_ids = db_class.get_recommendation_list(client_id, company_id,type)
#         print('publish',published_ids)

#         # Filter Published Class/Groups
#         final_df = Util.filter_df(final_df, published_ids, 'DescriptionId')

#         columns = ['BookingId', 'Name', 'StaffName', 'SessionTypeId',
#                    'StartDateTime', 'StaffId', 'Id', 'AppointmentStatus','Type','DescriptionId']
#         final_df = Util.get_df_by_column(final_df, columns)
#         print('publish_final',final_df)

#         # final_df = final_df[final_df['Id'].isna()]
#         # print('ddb',final_df)

#         if type == constant.CLASS_TYPE_CLASS:
#             result = db_class.list_class()
#         else:
#             result = db_class.list_group()
    
#         dynodb_df = pd.DataFrame(result)
#         if dynodb_df .empty:
#                  dynodb_df  = pd.DataFrame(columns=["SK"])

#         print(dynodb_df)
#         if type != constant.CLASS_TYPE_CLASS:
  
#             dynodb_df.loc[dynodb_df['Details.IsOpen'] == True ,
#                       'IsApproved'] = True
#             dynodb_df['Approved'] = dynodb_df['Approved'].apply(
#                 lambda d: d if isinstance(d, list) else [])
#             dynodb_df['IsApproved']= dynodb_df['IsApproved'].replace(np.nan, False)
#             print('nn',dynodb_df)
#             columns = {'SK': 'DescId', 'Details.Name': 'Names',
#                    'Details.CategoryId': 'CategoryId'}
#             dynodb_df.rename(columns=columns, inplace=True)
#             dynodb_df['DescId'] = dynodb_df['DescId'].astype('int64')
#             columns = ['DescId', 'Names', 'CategoryId', 'IsApproved', 'IsPending','Approved']
#             dynodb_df = Util.get_df_by_column(dynodb_df, columns)
#             dynodb_df.loc[dynodb_df['Approved'].str.len() != 0,
#                           'IsApproved'] = True
#             dynodb_df = Util.filter_df_by_column(dynodb_df, 'IsApproved', False)
#         else:  
#             print('nn',dynodb_df)
#             columns = {'SK': 'DescId', 'Details.Name': 'Names',
#                     'Details.CategoryId': 'CategoryId'}
#             dynodb_df.rename(columns=columns, inplace=True)
#             dynodb_df['DescId'] = dynodb_df['DescId'].astype('int64')
#             columns = ['DescId', 'Names', 'CategoryId']
#             dynodb_df = Util.get_df_by_column(dynodb_df, columns)
#         print('yyyy',dynodb_df)
        
      
#         # merge_df = pd.merge (final_df, dynodb_df, left_on=[
#         #     "DescriptionId"], right_on=["DescId"], how="inner")
#         # print('gg',merge_df)
            
                   
#         # columns = ['BookingId', 'Name', 'StaffName', 'SessionTypeId','Type','Id',
#         #            'StartDateTime', 'StaffId', 'DescriptionId', 'CategoryId','AppointmentStatus','IsApproved', 'DescId']
        
#         # merge_df= Util.get_df_by_column(merge_df, columns)

#         published_ids = db_class.get_recommendation_list(client_id, company_id,type)
#         print('publish',published_ids)

#         # Filter Published Class/Groups
#         final_df = Util.filter_df(dynodb_df, published_ids, 'DescId')

#         columns = ['BookingId', 'Names', 'StaffName', 'SessionTypeId','Type','Id',
#                    'StartDateTime', 'StaffId', 'DescriptionId', 'CategoryId','AppointmentStatus','IsApproved', 'DescId']
#         final_df = Util.get_df_by_column(final_df, columns)

#         return build_response(Util.to_dict(final_df))
        
#     except SecurityException as e:
#         return build_security_response([], e)
#     except APIValidationError as e:
#         return build_custom_err_response([], e)
#     except Exception as e:
#         return build_err_response([], e)

def _list(event, type):
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        if type == constant.CLASS_TYPE_CLASS:
            result = db_class.list_class()
        else:
            result = db_class.list_group()

        dynodb_df = pd.DataFrame(result)
        if dynodb_df .empty:
            dynodb_df = pd.DataFrame(columns=["SK"])

        print(dynodb_df)
        if type != constant.CLASS_TYPE_CLASS:

            dynodb_df.loc[dynodb_df['Details.IsOpen'] == True,
                          'IsApproved'] = True
            dynodb_df['Approved'] = dynodb_df['Approved'].apply(
                lambda d: d if isinstance(d, list) else [])
            dynodb_df['Pending'] = dynodb_df['Pending'].apply(
                lambda d: d if isinstance(d, list) else [])

            dynodb_df['IsApproved'] = dynodb_df['IsApproved'].replace(
                np.nan, False)
            
            columns = {'SK': 'DescId', 'Details.Name': 'Name',
                       'Details.CategoryId': 'CategoryId'}
            dynodb_df.rename(columns=columns, inplace=True)
            dynodb_df['DescId'] = dynodb_df['DescId'].astype('int64')
            columns = ['DescId', 'Name', 'CategoryId',
                       'IsApproved', 'IsPending', 'Approved','Pending','Details.IsOpen']
            dynodb_df = Util.get_df_by_column(dynodb_df, columns)
            print('nnssss', dynodb_df)
            dynodb_df.loc[dynodb_df['Approved'].str.len() != 0,
                          'IsApproved'] = True
            # dynodb_df = Util.filter_df_by_column(
            #     dynodb_df, 'IsApproved', False)
            print('ll',dynodb_df)

        else:
            print('nn', dynodb_df)
            columns = {'SK': 'DescId', 'Details.Name': 'Name',
                       'Details.CategoryId': 'CategoryId'}
            dynodb_df.rename(columns=columns, inplace=True)
            dynodb_df['DescId'] = dynodb_df['DescId'].astype('int64')
            columns = ['DescId', 'Name', 'CategoryId']
            dynodb_df = Util.get_df_by_column(dynodb_df, columns)

        print('yyyy', dynodb_df)

        # DB
        published_ids = db_class.get_recommendation_list(
            client_id, company_id, type)
        print('publish', published_ids)

        # Filter Published Class/Groups
        final_df = Util.filter_df(dynodb_df, published_ids, 'DescId')

        columns = ['DescId', 'CategoryId', 'Name','IsApproved','Pending','Approved','Details.IsOpen']
        final_df = Util.get_df_by_column(final_df, columns)
        print('publish_final', final_df)
        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
       
   


