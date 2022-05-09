import datetime
from datetime import datetime as date
import json
import pandas as pd
import time
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.helpers.shared_actions import do_booking_appt, update_appt, get_cancel_detail, get_reschedule_detail, update_class
from shared.utilities import constant
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.common import categories
from providers.dynamodb.modules import appt,category,client
from providers.mindbody.modules.sale import appt_cc
from providers.mindbody.modules.site import session_type
from providers.mindbody.modules.staff import staff
from providers.mindbody.modules.appointment import appt_cancel
from shared.helpers import session_helper
from providers.sendgrid.helpers.email_helper import send_template_email
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.mindbody.modules.client import client_visit



logger = get_logger(__name__)

def add_appt(event, context):
    try: 
       req_data = json.loads(event['body'])
       client_id = session_helper.get_client_id(event) 
       df = do_booking_appt(req_data,client_id)
      
       return build_response(df,status_code=200)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


# Get Appointment Cancel Summary


def get_cancel_appt(event, context):

    try:
        booking_id = Util.get_path_param(event, 'id')
        # booking_id="389"
        client_id = session_helper.get_client_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')
        cancel_df = get_cancel_detail(client_id, Util.to_int(booking_id))

        return build_response(Util.to_dict(cancel_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


# Reschedule
def get_reschedule_appt(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        client_id = session_helper.get_client_id(event)

        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        visit_df = get_reschedule_detail(
            client_id, Util.to_int(booking_id), True)

        return build_response(Util.to_dict(visit_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def reschedule(event,req_data):
    try:
        
        req_data = json.loads(event['body'])
        item = {
            'AppointmentId': req_data['booking_id'],
            'StartDateTime': req_data['startDateTime'],
            
        }
        item = json.dumps(item)
        resp_data = appt_cancel.update_appointment(item)
        resp_data = Util.get_dict_data(resp_data, 'Appointment')
        return build_response(resp_data)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


# Appointment Cancel
def cancel_appt(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        # booking_id ='389'
        client_id = session_helper.get_client_id(event) 
        cancel_type = ''
        # Determine Early or Late Cancel
        cancel_data = get_cancel_appt(event,context)
        cancel_data = json.loads(cancel_data["body"])
        cancel_data = cancel_data['data'][0]
        print(cancel_data)
        data1 = datetime.datetime.strptime(cancel_data['StartDateTime'],"%Y-%m-%dT%H:%M:%S")
        data2 = datetime.datetime.now()
        print(data2)
        diff = data1 - data2
        print('hh',diff)
        days, seconds = diff.days, diff.seconds
        hours = days * 24 + seconds // 3600
        
        if hours > constant.APPOINTMENT_HOURS:
            print('Early') 
            cancel_type ='E' 
        else:
            print("Late")
            epoch_time = Util.get_current_epoch()
            dyn_data = client.get_client(client_id)
            dyn_df = pd.json_normalize(dyn_data)
            dyn_df.loc[(dyn_df['Freebie'] == '1')|(dyn_df['Freebie'] == '0'),
                      cancel_type] = 'L' 
            print('lll',dyn_df)
            cancel_type = 'L'
            dyn_df = client.save_client(client_id,{'PendingGroups':dyn_df['PendingGroups'].loc[0],'ApprovedGroups':dyn_df['ApprovedGroups'].loc[0],'DeniedGroups':dyn_df['DeniedGroups'].loc[0],'Forms':{},'Freebie':'0','FreebieCancelledOn':epoch_time})
        resp = update_appt(booking_id, cancel_type)
        cancel_data = Util.get_dict_data(resp, 'Appointment')
        print('cancel',cancel_data)
        # staff_id = staff.get_staff_df({"staffIds": 'StaffId'})
        # df = pd.json_normalize(cancel_data)
        # date_time = df['StartDateTime'].loc[0]
        # created_date = datetime.datetime.strptime(date_time, '%Y-%m-%dT%H:%M:%S')
        # date_time = created_date.strftime("%Y-%m-%d")
        # time = created_date.strftime("%H:%M %p")
        # day = created_date.strftime("%A")
        
        # first_name = session_helper.get_client_first_name(event)
        # email = session_helper.get_client_email(event)
        # message_data= {
        #     "firstName": first_name,
        #     "day": day,
        #     "time": time,
        #     "date": date_time,
        #     "cancelledBy": staff_id['StaffName'].loc[0],
        #     "cancelledDate": date_time,
        #     "cancelledTime": time,
    
        # }
        # send_template_email(email,
        #                     constant.EMAIL_TEMPLATE_CANCEL_APPT, message_data)
        return build_response(resp)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

# Check-in


def check_in(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        resp = update_appt(booking_id, 'C')
        return build_response(resp)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

# Join-now
def join_now(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        resp = update_appt(booking_id, 'J')  
        resp['Url'] = constant.JOIN_NOW_URL

        return build_response(resp)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


def list_appts(event, context):
    try:
        # Appt Session Types
        appt_df = session_type.get_session_type_appt_df()
        result= appt.list_appt()
        print(result)
        dynodb_df = pd.json_normalize(result)
        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')
        # Merge Data
        merge_df = pd.merge(appt_df, dynodb_df, left_on=[
            'SessionTypeId'], right_on=['SK'], how="left")
        print(merge_df)
        # Dynamo DB - Category
        result = category.list_category()
        category_df = pd.json_normalize(result)
        columns = {'SK': 'CategoryId', 'Details.Name': 'CategoryName'}
        category_df.rename(columns=columns, inplace=True)
        category_df['CategoryId'] = category_df['CategoryId'].apply(str)
        # Merge w/Category
        merge_df['Details.CategoryId'] = merge_df['Details.CategoryId'].apply(str)
        print(merge_df)
        final_df = Util.get_df_by_column(merge_df, columns)
        print(final_df)

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
        return build_err_response([], e)


def pay_appt(event,context):
    try:
        client_id = session_helper.get_client_id(event)
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        item={
            "ClientId": client_id,
            "Test": False,
            "Items": [
                {
                    "Item": {
                    "Type": constant.SERVICE_TYPE,
                    "Metadata": {
                        "Id" :req_data['serviceId']
                        }
                   
                },
                "Quantity":constant.QUANTITY_VALUE,
                        "AppointmentBookingRequests":[
                {
                    "StaffId":req_data['staffId'],
                    "LocationId": req_data['locationId'],
                    "SessionTypeId": req_data['bookingId'],
                    "StartDateTime" : req_data['startDateTime']
                   
                }]
                }
            ],
           
            "Payments": [
                {
                "Type": constant.PAYMENT_TYPE,
                "Metadata": {
                    
                    "Amount": req_data['amount'],
                    "Id":constant.PAYMENT_ID
      	            
                }
                }
            ],
            
            "LocationId": req_data['locationId']
        }    
        
        resp_data= appt_cc.buy_appointment_cc(json.dumps(item))
        logger.debug('Request created: {%s}', resp_data)
        
        return build_response(resp_data,status_code=200)
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def landing_appt(event, context):
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
        dyn_data = client.get_client(client_id)
        dyn_df = pd.json_normalize(dyn_data)

        if len(data) == 0:
            visit_df = pd.DataFrame()
            visit_df['VisitType'] = ''
            visit_df['StaffId'] = ''
            visit_df['AppointmentStatus'] = ""
        else:
            visit_df = pd.DataFrame(data)
            columns = ['VisitType', 'AppointmentId', 'ClassId', 'StartDateTime', 'ClientId', 'AppointmentStatus', 'StaffId',
                       'SignedIn', 'MakeUp']
            visit_df = Util.get_df_by_column(visit_df, columns)
        staff_df = staff.get_staff_df()

        # Staff Merging
        merged_df = pd.merge(staff_df, visit_df, left_on=[
            "StaffId"], right_on=["StaffId"], how='inner')
        columns = ['VisitType', 'AppointmentId', 'StaffName', 'ClassId',
                   'StartDateTime', 'StaffId', 'AppointmentStatus', 'SignedIn', 'MakeUp', 'ClientId']
        merged_df = Util.get_df_by_column(merged_df, columns)

        result = appt.list_appt()
        dynodb_df = pd.json_normalize(result)
        if dynodb_df .empty:
            dynodb_df = pd.DataFrame(columns=["SK", 'Details.CategoryId'])
        columns = {'SK': 'Id', 'Details.Name': 'Name',
                   'Details.CategoryId': 'CategoryId'}
        dynodb_df.rename(columns=columns, inplace=True)

        columns = ['Id', 'Name', 'CategoryId']
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        dynodb_df['Id'] = dynodb_df['Id'].astype('int64')
        # Merge
        final_df = pd.merge(dynodb_df, merged_df, left_on=[
            "Id"], right_on=["VisitType"], how="left")

        columns = ['AppointmentId', 'StartDateTime', 'Id', 'Name', 'StaffName', 'ClientId',
                   'StaffId', 'CategoryId', 'AppointmentStatus', 'SignedIn', 'MakeUp']
        final_df1 = Util.get_df_by_column(final_df, columns)
        final_df1['ClientId'] = final_df1['ClientId'].fillna(0)
        final_df1['ClientId'] = final_df1['ClientId'].astype('int64')

        final_df1_merged = pd.merge(final_df1, dyn_df, left_on=[
                                    'ClientId'], right_on=['PK'], how='outer')
        columns = ['AppointmentId', 'StartDateTime', 'Id', 'Name', 'StaffName', 'ClientId',
                   'StaffId', 'CategoryId', 'AppointmentStatus', 'SignedIn', 'MakeUp', 'Freebie']
        final_df1_merged = Util.get_df_by_column(final_df1_merged, columns)
        print("final_df1_merged", final_df1_merged)
        # Permission and Recommendation list
        appt_ids = appt.get_recommendation_list(client_id, company_id)
        final_df2 = Util.filter_df_by_list(
            final_df1_merged, 'Id', appt_ids)
        final_df2.rename(columns={'AppointmentId': 'BookingId'}, inplace=True)

        return build_response(Util.to_dict(final_df2))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def list_appt(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        # Appt Session Types
        appt_df = session_type.get_session_type_appt_df()
        #Db List
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
        appt_ids = appt.get_active_list(client_id, company_id)
        final_df2 = Util.filter_df_by_list(
            final_df, 'SessionTypeId', appt_ids)

        return build_response(Util.to_dict(final_df2))

    except SecurityException as e:
            return build_security_response({}, e)
    except APIValidationError as e:
            return build_custom_err_response({}, e)
    except Exception as e:
            return build_err_response({}, e)

def list_categories (event,context):
    try:
        type = Util.get_path_param(event, 'type')
        resp_data = categories.category_list(type)

        return resp_data

    except SecurityException as e:
            return build_security_response([], e)
    except APIValidationError as e:
            return build_custom_err_response([], e)
    except Exception as e:
            return build_err_response([], e)
