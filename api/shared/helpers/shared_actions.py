from datetime import datetime
import json
import pandas as pd
import numpy as np
from providers.mindbody.modules.classes import add_class
from providers.mindbody.modules.appointment import appt_cancel,add_appts,active_session,bookable_item
from providers.mindbody.modules.client import update_client_visit
from providers.mindbody.modules.classes import remove_client,classes
from providers.mindbody.modules.sale import service
from providers.mindbody.modules.client import client_visit
from providers.dynamodb.modules import appt,client
from shared.exceptions.exception import APIValidationError
from shared.helpers import session_helper
from shared.helpers.api_helper import build_response
from shared.utilities.Util import Util

#Get Cancel Details
def get_cancel_detail(client_id, booking_id):
    
    params = {'clientId': client_id,'endDate':Util.get_default_end_date()}
    dyn_data = client.get_client(client_id)
    dyn_df = pd.json_normalize(dyn_data)
    resp_data = client_visit.get_client_visit(params)
    data_array = Util.get_dict_data(resp_data, 'Visits')
    if len(data_array) ==0:

        visit_df = pd.json_normalize(data_array)
        visit_df_rename = {'AppointmentId': 'appointmentId','ClassId': 'classId',
                        'Name': 'serviceName', 'ProductId':'productId','ClientId':'clientId'}
        visit_df.rename(columns=visit_df_rename, inplace=True) 
        visit_df['productId'] =''
        visit_df['classId'] =''
        visit_df['appointmentId'] =''
        visit_df['clientId'] =''
    else:
        visit_df = pd.json_normalize(data_array)
        visit_df_rename = {'AppointmentId': 'appointmentId','ClassId': 'classId',
                        'Name': 'serviceName', 'ProductId':'productId','ClientId':'clientId'}
        visit_df.rename(columns=visit_df_rename, inplace=True) 
        print(visit_df)
        visit_df['productId'] = visit_df['productId'].replace(np.nan, 0)
        visit_df['productId'] = visit_df['productId'].astype('int64') 
        data = Util.to_split_datetimeformat(data_array, 'StartDateTime')
        visit_df['startDate'] = data['startDate']
        visit_df['time'] = data['Time']
        columns = ['appointmentId','startDate', 'time', 'productId','serviceName','classId','StartDateTime','clientId']
        visit_df['clientId'] = visit_df['clientId'].astype('int64') 
        visit_df = Util.get_df_by_column(visit_df, columns)
        print(visit_df.dtypes,booking_id)
        visit_df = visit_df[(visit_df['classId']==booking_id) | (visit_df['appointmentId']==booking_id)]
        visit_df.loc[visit_df['classId'] > 0,
                      'bookingId'] = visit_df['classId']
        visit_df.loc[visit_df['appointmentId'] > 0,
                      'bookingId'] = visit_df['appointmentId']
        merge_visit_df = pd.merge(dyn_df, visit_df, left_on=[
                                  'PK'], right_on=['clientId'], how='inner')
        columns =['appointmentId','classId','bookingId','startDate', 'time', 'productId','serviceName','Freebie','StartDateTime','clientId']
        merge_visit_df = Util.get_df_by_column( merge_visit_df,columns) 
    print(visit_df)
    resp_data = service.get_services_list(params)
    data = Util.get_dict_data(resp_data, 'Services')
    df = pd.DataFrame(Util.to_lower_key(data))
    columns = ['id', 'name', 'price']
    df = Util.get_df_by_column(df, columns)
    df['id'] = df['id'].astype('int64') 
    df = df.fillna(0)
    print('cancel',df)
    print(df.dtypes)
    # Merge
    merge_df = pd.merge(merge_visit_df, df, left_on=[
        'productId'], right_on= ['id'], how='inner')
    print('ttt',merge_df)
    merge_df.loc[merge_df['appointmentId'] > 0,
                      'bookingId'] = merge_df['appointmentId']
    merge_df.loc[merge_df['classId'] > 0,
                      'bookingId'] = merge_df['classId']
    columns = ['bookingId', 'name', 'startDate','serviceName',
               'time',  'price','productId','StartDateTime','Freebie']
    merge_df = Util.get_df_by_column(merge_df, columns)
    merge_df = merge_df.replace(np.nan, 0)  
    if merge_df.empty:
        return merge_visit_df
    else:
        return merge_df


#GET Reschedule Details
def get_reschedule_detail(client_id, booking_id, is_appt):
    params = {'clientId': client_id, 'endDate': Util.get_default_end_date()}

    resp_data = client_visit.get_client_visit(params)
    data_array = Util.get_dict_data(resp_data, 'Visits')
    visit_df = pd.json_normalize(data_array)
    if len(data_array) == 0:
            visit_df = pd.DataFrame()
            visit_df['sessionId'] = ''
    else:
        visit_df = pd.json_normalize(data_array)
            

        if is_appt:
            booking_column = 'AppointmentId'
        else:
            booking_column = 'ClassId'

        columns = {booking_column: 'bookingId', 
               'StaffId': 'staffId', 'VisitType': 'sessionId','Name':'sessionname'}

        visit_df.rename(columns=columns, inplace=True)

        columns = ['bookingId',  'staffId', 'sessionId','sessionname']
        visit_df = Util.get_df_by_column(visit_df, columns)

    result = appt.list_appt()
    dynodb_df = pd.json_normalize(Util.to_lower_key(result))
    columns = {'sK': 'id', 
                   'details.CategoryId': 'categoryId'}
    dynodb_df.rename(columns=columns, inplace=True)

    columns = ['id',  'categoryId']
    dynodb_df = Util.get_df_by_column(dynodb_df, columns)
    dynodb_df['id'] = dynodb_df['id'].astype('int64')
    
    final_df = pd.merge (dynodb_df, visit_df, left_on=[
            "id"], right_on=["sessionId"], how="right")  
    # 
    columns = ['bookingId','sessionId','staffId', 'categoryId','sessionname']
    final_df= Util.get_df_by_column(final_df, columns)
    final_df =final_df[final_df.bookingId == booking_id]
    

    return final_df

#Class Booking
def do_booking(booking_id,client_id,booking_status):
    is_free = True if booking_status[0]['BookingStatus'] == "Free" else False   
    item = {
        'ClassId':int(booking_id),
        'RequirePayment':is_free,
        'SendEmail':True,
        'ClientId':str(client_id),
        'Test':False
    }
    resp_data = add_class.create_client_class(json.dumps(item))
    print('iii',resp_data)
    return resp_data

#Update Appt 
def update_appt(booking_id, type):

    if type == 'C':
        status = 'confirm'
    elif type == 'J':
        status = 'complete'
    elif type == 'L':
        status = 'Latecancel'
    elif type == 'E':
        status = 'Cancel'
   

    item = {
        'AppointmentId': booking_id,
        'Notes': 'Updated @' + str(Util.get_timestamp()),
        'Execute': status,
        'Test': False,
        'SendEmail':True
    }
    item = json.dumps(item)
    resp_data = appt_cancel.update_appointment(item)
    resp_data = Util.get_dict_data(resp_data, 'Appointment')
    return resp_data

#Joinnow  for class 
def visit_class(booking_id):
    

    item = {
        'VisitId': booking_id,
        "MakeUp":True,  
        'SendEmail':True
    }
    item = json.dumps(item)
    resp_data = update_client_visit.add_update_client_visit(item)
    resp_data = Util.get_dict_data(resp_data, 'Visit')
    data = pd.json_normalize(resp_data)
    columns = ['ClassId','Id']
    df= Util.get_df_by_column(data,columns)
    
    df.rename(columns = {'Id':'visitId'}, inplace = True)
    print('ff',df)

    resp_data = classes.get_class_list(params={'endDateTime':Util.get_default_end_date()})
    data = Util.get_dict_data(resp_data, "Classes")
    class_df = pd.json_normalize(data)
    columns=['Id','ClassDescription.Id']
    class_df = Util.get_df_by_column(class_df, columns)  
    print('ffa',class_df)

    merge_df = pd.merge (class_df,df ,left_on=['Id'], right_on=['ClassId'], how='inner')
    print('ffab',merge_df)
    return merge_df


#Class Checkin
def checkin_class(booking_id):
    

    item = {
        'VisitId': booking_id,
        "Signedin":True,  
        'SendEmail':True
    }
    item = json.dumps(item)
    resp_data = update_client_visit.add_update_client_visit(item)
    resp_data = Util.get_dict_data(resp_data, 'Visit')
    return resp_data

#Class Cancel
def update_class(client_id,booking_id, late_cancel):
    item = {
        'ClassId': booking_id,
        'ClientId':client_id,
        'LateCancel': late_cancel,
        'Test': False
    }
    item = json.dumps(item)
    resp_data= remove_client.del_client_class(item)
    resp_data = Util.get_dict_data(resp_data, 'Class')
    return resp_data


#ShoppingCart Appt

def do_booking_appt(req_data,client_id):
    
    item = {
            'ApplyPayment':True,
            'SessionTypeId': req_data['bookingId'],
            'ClientId':client_id,
            'StartDateTime':req_data['startDateTime'],
            "StaffId":req_data['staffId'],
            "LocationId":req_data['locationId'],
            "SendEmail" :True,
            'Test':False
            }           
                       
    resp_data = add_appts.create_appointment(json.dumps(item)) 
    return resp_data


def bookable_item_list(event,sessiontype_id):

        print('ss',sessiontype_id)
        params = {'sessiontypeIds': sessiontype_id, 'endDate': Util.get_default_end_date()}
        resp_data = active_session.get_active_session_list(params)
        data_array = Util.get_dict_data(resp_data, 'ActiveSessionTimes')
      
        dates = []
        for iso_ts in data_array:
            print(iso_ts)
            date = datetime.strptime(iso_ts, '%H:%M:%S').strftime("%I:%M %p")
            
            dates.append(date)
        data = pd.DataFrame({'startTime':dates})   
        resp_data = bookable_item.get_bookable_item_list(params)
        
        data_array = Util.get_dict_data(resp_data, 'Availabilities')
        df1 = pd.json_normalize(data_array)
        
        df1.rename(columns = {'SessionType.Id':'sessionId'}, inplace = True) 
        df1.rename(columns = {'SessionType.Name':'sessionName'}, inplace = True) 
        df1.rename(columns = {'Staff.Id':'staffId'}, inplace = True) 
        df1.rename(columns = {'Location.Id':'locationId'}, inplace = True) 
        book_data = Util.to_split_date(data_array, 'StartDateTime','EndDateTime')

        df1['startDate'] = book_data['startDate']
        df1['time'] = book_data['Time']
        df1['startisAM'] =book_data['startisAM']
        df1['endDate'] = book_data['endDate']
        df1['endtime'] = book_data['endTime']
        df1['endisAM'] = book_data['endisAM']
        
        columns = ['id','sessionId','sessionName','locationId','staffId','startDate','time','startisAM','startDateTime','endDate','endtime','endisAM']
        df1 = Util.get_df_by_column(df1, columns)  
       

        merge_df = pd.merge(data,df1,left_on=['startTime'], right_on=['time'], how = 'right')
        columns = ['id','startTime','sessionId','sessionName','locationId','staffId','startDate','time','startisAM','startDateTime','endDate','endtime','endisAM']
        merge_df = Util.get_df_by_column(merge_df, columns)
        merge_df["startTime"] = merge_df["startTime"].fillna(merge_df["time"])

        return build_response(Util.to_dict(merge_df))


    