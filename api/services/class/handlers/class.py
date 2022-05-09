import json
import pandas as pd
import numpy as np
from datetime import datetime
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.helpers.shared_actions import checkin_class, do_booking, get_cancel_detail, update_class, visit_class
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from shared.common import categories
from providers.mindbody.modules.classes  import classes,class_schedule,class_visit, class_description
from providers.mindbody.modules.staff  import staff
from providers.mindbody.modules.site  import session_type
from providers.mindbody.modules.sale  import appt_cc
from providers.dynamodb.modules import db_class , group,category,client
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException


logger = get_logger(__name__)
# Consult /Description/Book Class

def list_class(event, context):
    try:
        
        params = { 'endDateTime': Util.get_default_end_date()}
        resp_data = classes.get_class_list(params)
        data = Util.get_dict_data(resp_data, "Classes")
        if len(data)>0:
            df = pd.json_normalize(Util.to_lower_key(data))
            df.rename(columns = {'classDescription.Program.Id':'programId'}, inplace = True)
            df.rename(columns = {'classDescription.SessionType.Id':'sessionTypeId'}, inplace = True)
            df.rename(columns = {'classDescription.SessionType.Name':'sessionTypeName'}, inplace = True)
            df.rename(columns = {'classDescription.Program.Name':'programName'}, inplace = True)
            df.rename(columns = {'classDescription.Id':'descId'}, inplace = True)
            df.rename(columns = {'classDescription.Name':'descName'}, inplace = True)
            df.rename(columns = {'classDescription.Description':'description'}, inplace = True)
            df.rename(columns = {'classDescription.ImageURL':'imageURL'}, inplace = True)
            df.rename(columns = {'staff.Id':'staffId'}, inplace = True)
            df.rename(columns = {'staff.FirstName':'staffFname'}, inplace = True)
            df.rename(columns = {'staff.LastName':'staffLname'}, inplace = True)
            # df.rename(columns = {'id':'class_id'}, inplace = True)
            df['staffName'] = df['staffFname'] + ' ' + df ['staffLname']
            columns = ['id','descId','sessionTypeId','descName','description','imageURL','sessionTypeName','programId','staffId','staffName','bookingStatus']
            df = Util.get_df_by_column(df, columns)

            # Get the Group List from DynamoDB, Create an Array of IDs, Filter DF (Skip Group Classes)
            group_list = group.list_group();
            group_ids = Util.get_dict_values(group_list, 'SK')
            df1 = Util.filter_df(df, group_ids, 'id', False)
            print(df1)
            df2 = pd.DataFrame(Util.to_lower_key(df1))
            df2.rename(columns = {'sK':'id'}, inplace = True)
            
            df2.rename(columns = {'descName':'name'}, inplace = True)
            columns = ['id','name']
            df2 = Util.get_df_by_column(df2, columns)

            #Merge
            merge_df = pd.merge(df,df2,on=["id"], how="outer")
            columns = ['ClassScheduleId','descId','id','sessionTypeId','name','description','imageURL','sessionTypeName','programId','staffId','staffName','bookingStatus']
            merge_df = Util.get_df_by_column(merge_df, columns)  

            return build_response(Util.to_dict(merge_df))
        else:
             return build_response(data)
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


#Class Schedule        
def class_schedules(event, context):
    try:
        
       
        params = {'ClassIds':'433','endDateTime': Util.get_default_end_date()}

        logger.debug('Retrieve Class schedules {%s}', params)
    
        resp_data = classes.get_class_list(params)
        data = Util.get_dict_data(resp_data, "Classes")
        class_df = pd.json_normalize(data)
        class_df.rename(columns = {'Id':'ClassId'}, inplace = True)
        columns = ['ClassId','ClassScheduleId','StartDateTime','EndDateTime']
        class_df = Util.get_df_by_column(class_df, columns)  
        print('sss',class_df)


        resp_data = class_schedule.get_class_schedule(params)
        data_array = Util.get_dict_data(resp_data, "ClassSchedules")
        
        df= pd.json_normalize(data_array)
        df.rename(columns = {'ClassDescription.Name':'Name'}, inplace = True)
        df.rename(columns = {'ClassDescription.SessionType.Id':'SessionTypeId'}, inplace = True)
               
        
        data = Util.to_split_datetime(data_array, 'StartDate','EndDate','StartTime','EndTime')
        df['sDate']=data['startDate']
        df['Times']=data['stimes']
        df['startisAM']=data['startisAM']
        df['eDate']=data['endDate']
        df['ETimes']=data['etimes']
        df['endisAM']=data['endisAM']

 
        columns = ['Id','Name','StartDate','DaySunday','DayMonday','DayTuesday','DayWednesday','DayThursday','DaySaturday','DayFriday','sDate','Times','startisAM','eDate','ETimes','endisAM']
        df = Util.get_df_by_column(df, columns)

        merge_df = pd.merge(class_df,df ,left_on = ['ClassScheduleId'] ,right_on = ['Id'],how = 'inner')
        columns=['Id','ClassId','Name','StartDate','DaySunday','DayMonday','DayTuesday','DayWednesday','DayThursday','DaySaturday','DayFriday','sDate','Times','startisAM','eDate','ETimes','endisAM']
        merge_df = Util.get_df_by_column(merge_df, columns)

        return build_response(Util.to_dict(merge_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)
        

   

#Create Class
def book_class(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        # booking_id = '968'
        client_id = session_helper.get_client_id(event)
        params = {
             'classIds':booking_id,'endDateTime':Util.get_default_end_date()}
        resp = classes.get_class_list(params)
        print('@@@',resp)
        data = Util.get_dict_data(resp, 'Classes') 
        class_df =pd.DataFrame(data)
        columns = ['Id','BookingStatus']
        class_df = Util.get_df_by_column(class_df, columns)
        print('###',class_df)
        
        df = do_booking( booking_id,client_id,Util.to_dict(class_df))
                            
        return build_response(df)  
        
    except SecurityException as e:
        return build_security_response({}, e)  
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)        
         
        

     
#Remove Client from Class
def cancel_class(event, context):
    try:
        booking_id = Util.get_path_param(event, 'id')
        # booking_id ='394'
        client_id = session_helper.get_client_id(event)
       
        late_cancel =""
        # Determine Early or Late Cancel
        cancel_data = get_cancel_class(event,context)
        cancel_data = json.loads(cancel_data["body"])
        cancel_data = cancel_data['data'][0]
        print(cancel_data)
        data1 = datetime.strptime(cancel_data['StartDateTime'],"%Y-%m-%dT%H:%M:%S")
        data2 = datetime.now()
        print(data2)
        diff = data1 - data2
        days, seconds = diff.days, diff.seconds
        hours = days * 24 + seconds // 3600
        print('hous',hours)
        if hours > constant.APPOINTMENT_HOURS:
            print('Early')
            late_cancel = False
        else:
            print("Late")
            epoch_time = Util.get_current_epoch()
            dyn_data = client.get_client(client_id)
            dyn_df = pd.json_normalize(dyn_data)
            dyn_df.loc[(dyn_df['Freebie'] == '1')|(dyn_df['Freebie'] == '0'),
                      late_cancel] = True
            print('lll',dyn_df)
            late_cancel = True
            dyn_df = client.save_client(client_id,{'PendingGroups':dyn_df['PendingGroups'].loc[0],'ApprovedGroups':dyn_df['ApprovedGroups'].loc[0],'DeniedGroups':dyn_df['DeniedGroups'].loc[0],'Forms':{},'Freebie':'0','FreebieCancelledOn':epoch_time})
        
        resp = update_class(client_id,booking_id,late_cancel)
        return build_response(resp)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#Class Visit
def cancel_visit(event, context):
    try:
        class_id = session_helper.get_class_id(event)
        if not class_id:
            raise APIValidationError(
                'API Request is incomplete. Class_Id is required')

        params = {'classId': class_id}    
        logger.debug('Retrieve class visit {%s}', params)#
        resp_data = class_visit.get_class_visit(params)
        data = Util.get_dict_data(resp_data, 'Visits')
        if len(data)>0:
            visit_df = pd.DataFrame(Util.to_lower_key(data))
            visit_df.rename(columns = {'name':'className'}, inplace = True)
            visit_df.rename(columns = {'id':'visitid'}, inplace = True)
            columns = ['visitid','className','startDateTime', 'endDateTime','visitType','appointmentStatus','staffId','classId']
            visit_df = Util.get_df_by_column(visit_df, columns)
            visit_df = visit_df[visit_df['classId']>0]

            #session
            resp_data = session_type.get_session_type_list(params)
            data = Util.get_dict_data(resp_data, 'SessionTypes')
            session_df = pd.DataFrame(Util.to_lower_key(data))
            session_df.rename(columns = {'id':'sessionTypeId'}, inplace = True)
            columns = ['sessionTypeId','name','type']
            session_df = Util.get_df_by_column(session_df, columns)

            merg_df = pd.merge(visit_df,session_df, left_on=["visitType"], right_on=["sessionTypeId"],  how="inner")
            columns = ['sessionTypeId','classId','className','startDateTime','appointmentStatus','staffId','type','visitid']
            merg_df = Util.get_df_by_column(merg_df, columns)
            merg_df = merg_df[merg_df['type']=='Class']

            #staff
            params = {'limit': 200} 
            resp_data = staff.get_staff_list(params)
            data = Util.get_dict_data(resp_data, 'StaffMembers')
            staff_df = pd.DataFrame(Util.to_lower_key(data))
            staff_df.rename(columns = {'name':'staffName'}, inplace = True)

            merged_df = pd.merge(staff_df,merg_df, left_on=["id"], right_on=["staffId"])
            columns = ['classId','className','staffName','startDateTime','appointmentStatus','visitid', 'sessionTypeId','staffId']
            merged_df = Util.get_df_by_column(merged_df, columns)
        
            return build_response(Util.to_dict(merged_df))
        else:
            logger.debug('No data available')
            return build_response(data)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def class_descriptions(event, context):
    try:
       
        params = { 'endDate': Util.get_default_end_date()}
        logger.debug('Retrieve Classe Descriptions for Parameters {%s}', params)
       
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        df = pd.json_normalize(data)
        df.rename(columns = {'Program.Id':'ProgramId'}, inplace = True)
        df.rename(columns = {'SessionType.Id':'SessionTypeId'}, inplace = True)
        df.rename(columns = {'SessionType.Name':'SessionTypeName'}, inplace = True)
        df.rename(columns = {'Program.Name':'ProgramName'}, inplace = True)
        columns = ['Id','Description', 'ImageURL','SessionTypeId','Name','SessionTypeName','ProgramId']
        df = Util.get_df_by_column(df, columns)
        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([],e)
    except Exception as e:
        return build_err_response([], e)


#Book Class
def buy_class(event,context):
    try:
        
        client_id = session_helper.get_client_id(event)
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        item={
                        
            "ClientId": client_id,
            "Test": req_data['test'],
             "Items": [
                {
                "Item": {
                    "Type": req_data['type'],
                    "Metadata": {
                       "Id" :req_data['serviceId']
                    }
            
                },
                 "Quantity":req_data['quantity'],
                "ClassIds":[req_data['bookingId']] 
                }
            ],
           
             "Payments": [
                {
                "Type": req_data['paymenttype'],
                "Metadata": {
                    
                    "Amount": req_data['amount'],
                    "Id":req_data['paymentId'],
      	            
                }
                }
            ],
            "LocationId": req_data['locationId']
            }  
        resp_data= appt_cc.buy_appointment_cc(json.dumps(item))
    
        return build_response(resp_data,status_code=200)
        
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


def list_classes(event, context):
    return _list(constant.CLASS_TYPE_CLASS,event)


def list_groups(event, context):
    return _list(constant.CLASS_TYPE_GROUP,event)

def _list(type,event):
    try:
        # class from Mindbody
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        params = {}
        logger.debug('Retrieve Classes for Parameters {%s}', params)
        # Get All Classes From Dynamo DB
        dynodb_df = db_class.list()
        
        # Added Check to check if valid Dataframe exists
        if dynodb_df.empty:
            dynodb_df = pd.DataFrame(columns=["SK", "Details.CategoryId"])

        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')
        columns = {'Details.Type','Details.CategoryId', 'Details.IsPublished',
                   'Details.Name', 'SK', 'Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn'}
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')
        
        # Identify Group/Class
        if (type == constant.CLASS_TYPE_CLASS):
            df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', constant.CLASS_TYPE_GROUP)
        else:
            df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', constant.CLASS_TYPE_CLASS)

        exclude_ids = df['SK'].astype('int64').to_list()

        # Seperate Class/Group
        dynodb_df = Util.filter_df_by_column(
            dynodb_df, 'Details.Type', type)

        # Retrieve All Mindbody Classes
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        class_df = pd.json_normalize(data)
        columns = {'Id', 'SessionType.Id', 'Name',
                   'Description', 'ImageURL'}
        class_df = Util.get_df_by_column(class_df, columns)

        # Filter Class/Groups
        class_df = Util.filter_df(class_df, exclude_ids, 'Id', False)

        merge_df = pd.merge(class_df, dynodb_df, left_on=[
            'Id'], right_on=['SK'], how="outer")
        columns = {'Details.CategoryId', 'Details.IsPublished','Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn',
                   'Details.Name', 'SK', 'Description', 'Name', 'Id', 'Details.Type', 'ImageURL'}
        merge_df = Util.get_df_by_column(merge_df, columns)
       
        
        # Dynamo DB - Category
        result = category.list_category()
        category_df = pd.json_normalize(result)
        if category_df.empty:
            category_df = pd.DataFrame(columns=["CategoryId"])
        columns = {'SK': 'CategoryId', 'Details.Name': 'CategoryName'}
        category_df.rename(columns=columns, inplace=True)

        # Merge w/Category
        final_df = pd.merge(merge_df, category_df, left_on=[
            "Details.CategoryId"], right_on=["CategoryId"], how="left")
        final_df.rename(columns = {'Details.Type_x':'Details.Type'},inplace=True)
        columns = ['SK', 'Details.Name', 'CategoryId', 'CategoryName','Details.IsOpen','Promotion.GlobalIn', 'Access.GlobalIn',
                   'Details.IsPublished', 'Id', 'Name', 'Description', 'Details.Type', 'ImageURL']
        final_df = Util.get_df_by_column(final_df, columns)
        
       
        final_df["Name"] = final_df["Name"].fillna(final_df["Details.Name"])
        final_df['Details.IsPublished'] = final_df['Details.IsPublished'].replace(
            np.nan, "false")
        final_df = final_df.replace(np.nan, "")

        class_ids = db_class.get_active_list(client_id, company_id,type)
        final_df2 = Util.filter_df_by_list(
            final_df, 'Id', class_ids)
       

        return build_response(Util.to_dict(final_df2))

        
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)

def get_cancel_class(event, context):

    try:
        booking_id = Util.get_path_param(event, 'id')
        # booking_id ='394'
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

def class_join_now(event,context):
    booking_id =  Util.get_path_param(event, 'id')
    type = constant.CLASS_TYPE_CLASS
    return _join_now(booking_id, type)

def group_join_now(event,context):
    booking_id =  Util.get_path_param(event, 'id')
    type = constant.CLASS_TYPE_GROUP
    return _join_now(booking_id, type)
    
#Class Join Now
def _join_now (booking_id,type):
    
    try:
        class_df = visit_class(booking_id)
        if type == constant.CLASS_TYPE_CLASS:
            dynamo_df = db_class.list_class()
        else:
            dynamo_df = db_class.list_group()
        print('jj',dynamo_df)

        columns = {'Details.ZoomUrl','SK'}
        dynamo_df = Util.get_df_by_column(dynamo_df, columns)  
        dynamo_df['SK'] = dynamo_df['SK'].astype('int64')
        #merge
        merge_df = pd.merge(dynamo_df,class_df ,left_on ='SK',right_on = 'ClassDescription.Id', how = 'inner')
        columns = ['Id','ClassDescription.Id','Details.ZoomUrl','SK']

        final_df = Util.get_df_by_column(merge_df,columns)
        final_df = final_df.replace(np.nan, "")
        final_df.loc[final_df['Details.ZoomUrl'] == '',
                     'Details.ZoomUrl'] = constant.JOIN_NOW_URL


        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#Class check-in
def class_checkin (event,context):
    
    try:
        booking_id = Util.get_path_param(event, 'id')
        resp = checkin_class(booking_id)
    
        return build_response(resp)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)