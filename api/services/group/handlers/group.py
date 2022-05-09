import json
import pandas as pd
from cerberus import Validator
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.enrollment  import client_enroll
from providers.mindbody.modules.classes  import class_schedule
from shared.helpers import session_helper
from providers.mindbody.modules.classes  import classes , class_description
from shared.exceptions.exception import APIValidationError
from schema import client_group
from providers.dynamodb.modules import group, client
from shared.utilities import constant

logger = get_logger(__name__)

def list_class(event, context):
    try:
        client_id= session_helper.get_client_id(event)
        params = { 'endDate': Util.get_default_end_date(),'clientIds': client_id}
       
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
            df.rename(columns = {'id':'class_id'}, inplace = True)
            df['staffName'] = df['staffFname'] + ' ' + df ['staffLname']
            columns = ['class_id','descId','sessionTypeId','descName','description','imageURL','sessionTypeName','programId','staffId','staffName','bookingStatus']
            df = Util.get_df_by_column(df, columns)
            print(df)
            client_group_list = client.list_group(client_id);
            client_group_list = list(filter(lambda rec: (rec['Details']['StatusIn'] == 'A' ) , client_group_list))
            client_group_ids = Util.get_dict_values(client_group_list, 'SK')
            client_group_ids = Util.trim_prefix(client_group_ids, 'GROUP#')
            df = Util.filter_df(df, client_group_ids, 'sessionTypeId', True)
            df2 = pd.DataFrame(Util.to_lower_key(df))
            print(df2)

            merged_df2 = pd.merge(df,df2, left_on=["sessionTypeId"], right_on=["sessionTypeId"], how="outer")
            columns = ['class_id','descId','sessionTypeId','descName','description','imageURL','sessionTypeName','programId','staffId','staffName','bookingStatus']
            merged_df2 = Util.get_df_by_column(df, columns)

            return build_response(Util.to_dict(merged_df2))
        else:
            return build_response(data)

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def class_schedules(event, context):
    try:
        
        start_dt = session_helper.get_start_dt(event)
        end_dt = session_helper.get_end_dt(event)
        params = {}

        if start_dt:
            params["startDate"] = start_dt
        if end_dt:
            params["endDate"] = end_dt
        logger.debug('Retrieve Class schedules {%s}', params)

        resp_data = class_schedule.get_class_schedule(params)
        data_array = Util.get_dict_data(resp_data, "ClassSchedules")
        if len(data_array)>0:
            data = Util.to_split_datetime(data_array, 'StartDate','EndDate','StartTime','EndTime')
        
            df= pd.json_normalize(data)
            df['sDate']=data.sdates1
            df['Times']=data.stimes
            df['startisAM']=data.sisAMs
            df['eDate']=data.edates1
            df['ETimes']=data.etimes
            df['endisAM']=data.eisAMs
            df.rename(columns = {'ClassDescription.Program.Id':'ProgramId'}, inplace = True)
            df.rename(columns = {'ClassDescription.SessionType.Id':'SessionTypeId'}, inplace = True)
            df.rename(columns = {'ClassDescription.SessionType.Name':'SessionTypeName'}, inplace = True)
            df.rename(columns = {'ClassDescription.Program.Name':'ProgramName'}, inplace = True)
            df.rename(columns = {'Staff.Id':'StaffId'}, inplace = True)
            
            columns = ['Id','ProgramId','ProgramName','StaffId','SessionTypeName','SessionTypeId','StartDate','DaySunday','DayMonday','DayTuesday','DayWednesday','DayThursday','DaySaturday','sDate','Times','startisAM','eDate','ETimes','endisAM']
            df = Util.get_df_by_column(df, columns)

            return build_response(Util.to_dict(df))
        else:
            return build_response(data_array)
    
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)



#Add Client to enrollments
def enroll_client(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)

        validator = Validator(client_group.ClientToEnrollPOSTSchema ,
                              purge_readonly=True)
        if not validator.validate(req_data):
           raise APIValidationError(Util.to_str(validator.errors))
        if req_data:
            req_data = json.dumps(req_data)
        
        resp_data= client_enroll.add_enroll(req_data)
        logger.debug('Request created: {%s}', resp_data)
        resp_data = Util.get_dict_data(resp_data, 'Classes')
        print(resp_data)
        df = pd.json_normalize(resp_data)
        columns = ['Id','ClassScheduleId','StartDateTime','EndDateTime','Clients']
        df = Util.get_df_by_column(df, columns)

        # params={'limit':200}
        # resp_data = staff.get_staff_list(params)
        # data = Util.get_dict_data(resp_data, 'StaffMembers')
        # staff_df = pd.json_normalize(data)
        # staff_df.rename(columns = {'Name':'StaffName'}, inplace = True)
        # merged_df = pd.merge(staff_df,df, on=["StaffId"])

        # columns = ['StaffName','Id','ClassId','StartDateTime','EndDateTime','Name','StaffId','ClientId','BookingStatus']
        # class_staff = Util.get_df_by_column(merged_df, columns)

        return build_response(Util.to_dict(df)) 

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

# Request to Join

def request_to_join (event, context):
    try:
        client_id= session_helper.get_client_id(event)
        group_id = 21260
        # Build (Partial) Object and call Save
        details = {
            'RequestDt': Util.get_timestamp(),
            'StatusIn': constant.REQUEST_PENDING
         }
        result = client.request_join(client_id, group_id, details)
        logger.debug(result)

        client_group_list = client.list_group(client_id);
        client_group_list = list(filter(lambda rec: rec['Details']['StatusIn'] == 'P', client_group_list))
        client_group_ids = Util.get_dict_values(client_group_list, 'SK')
        client_group_ids = Util.trim_prefix(client_group_ids, 'GROUP#')

    except APIValidationError as e:
        return build_custom_err_response({}, e)

#Process Request
def process_request(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from 'Request to Join' Action
        client_id = session_helper.get_client_id(event)
        group_id = 21260
        request_type = constant.REQUEST_APPROVED   # Retrieve from Request Object
        # request_type = constant.REQUEST_DENIED
        # request_type = constant.REQUEST_WITHDRAWN
        result = client.process_request(client_id, group_id, request_type)
        logger.debug(result)
        client_group_list = client.list_group(client_id);
        client_group_list = list(filter(lambda rec: rec['Details']['StatusIn'] == 'A', client_group_list))
        client_group_ids = Util.get_dict_values(client_group_list, 'SK')
        client_group_ids = Util.trim_prefix(client_group_ids, 'GROUP#')

    except APIValidationError as e:
        return build_custom_err_response({}, e)

def group_descriptions(event, context):
    try:
        client_id= session_helper.get_client_id(event)
        params = { 'endDate': Util.get_default_end_date(),'clientIds': client_id}
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        df = pd.json_normalize(data)
        df.rename(columns = {'Program.Id':'programId'}, inplace = True)
        df.rename(columns = {'SessionType.Id':'sessionTypeId'}, inplace = True)
        df.rename(columns = {'SessionType.Name':'sessionTypeName'}, inplace = True)
        df.rename(columns = {'Program.Name':'programName'}, inplace = True)
        df.rename(columns = {'Id':'id'}, inplace = True)
        df.rename(columns = {'Description':'description'}, inplace = True)
        df.rename(columns = {'ImageURL':'imageURL'}, inplace = True)
        df.rename(columns = {'Name':'name'}, inplace = True)
        columns = ['id','description', 'imageURL','sessionTypeId','name','sessionTypeName','programId']
        df = Util.get_df_by_column(df, columns)
        print(df)

        client_group_list = client.list_group(client_id);
        client_group_list = list(filter(lambda rec: (rec['Details']['StatusIn'] == 'A' ) , client_group_list))
        client_group_ids = Util.get_dict_values(client_group_list, 'SK')
        client_group_ids = Util.trim_prefix(client_group_ids, 'GROUP#')
        df = Util.filter_df(df, client_group_ids, 'sessionTypeId', True)
        df2 = pd.DataFrame(Util.to_lower_key(df))
        print(df2)

        merged_df2 = pd.merge(df,df2, left_on=["sessionTypeId"], right_on=["sessionTypeId"], how="left")
        print(merged_df2)
        merged ={'description_x':'description','sessionName_x':'sessionName'}
        merged_df2.rename(columns = merged, inplace = True)
        columns = ['id','description', 'imageURL','sessionTypeId','name','sessionTypeName','programId']
        merged_df3 = Util.get_df_by_column(merged_df2, columns)


        return build_response(Util.to_dict(merged_df3))

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)