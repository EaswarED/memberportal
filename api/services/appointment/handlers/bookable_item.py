from datetime import datetime
import pandas as pd
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.helpers.shared_actions import bookable_item_list
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.appointment import bookable_item,active_session
from providers.mindbody.modules.client import client_visit
from providers.dynamodb.modules import appt
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)

def list_bookable_items(event, context):
        sessiontype_id = Util.get_path_param(event, 'id')
        return _bookable(event,sessiontype_id)
def consult_bookable_items(event, context):
        sessiontype_id = Util.get_path_param(event, 'id')
        if sessiontype_id:
            sessiontype_id = sessiontype_id  
        else:
            sessiontype_id = '19'   
        return _bookable(event,sessiontype_id)

def _bookable(event,id):
    try:
      
        resp = bookable_item_list(event,id)
       
        return resp
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


def list_recommended_appts(event, context):
    
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        # params = {
        #     'clientId': client_id,
        #     'endDate': Util.get_default_end_date()
        # }
        # logger.debug('Retrieve Visits name for Parameters {%s}', params)

        # # Client Booked Appointment / Class
        # resp_data = client_visit.get_client_visit(params)
        # data = Util.get_dict_data(resp_data, 'Visits')
     
        # if len(data) == 0:
        #     visit_df = pd.DataFrame()
        #     visit_df['VisitType'] = ''
        # else:
        #     visit_df = pd.DataFrame(data)
        #     columns = ['VisitType','AppointmentId']
        #     visit_df = Util.get_df_by_column(visit_df, columns)
        #     visit_df.rename(columns={'AppointmentId': 'BookingId'}, inplace=True)
            
        
        result = appt.list_appt()
        dynodb_df = pd.json_normalize(result)
        columns = {'SK': 'Id', 'Details.Name': 'Name',
                   'Details.CategoryId': 'CategoryId'}
        dynodb_df.rename(columns=columns, inplace=True)

        columns = ['Id', 'Name', 'CategoryId']
        dynodb_df = Util.get_df_by_column(dynodb_df, columns)
        dynodb_df['Id'] = dynodb_df['Id'].astype('int64')

        print('vv',dynodb_df)

        # dynodb_df = dynodb_df[dynodb_df['Id'].isin(visit_df['VisitType'])]  
        # print('kkk',dynodb_df)
        appt_ids = appt.get_recommendation_list(client_id, company_id)
        final_df = Util.filter_df_by_list(
             dynodb_df, 'Id', appt_ids)
        print('ll',final_df)
            
        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


def session_times(event, context):
    try:
        sessiontype_id = Util.get_path_param(event, 'id')
        logger.debug(sessiontype_id)

        if not sessiontype_id:
            raise APIValidationError(
                'API Request is incomplete. Sessiontype_Id is required')
        params = {'sessiontypeIds': sessiontype_id}
       
        logger.debug('Retrieve BookableItem for Parameters {%s}', params)
        resp_data = active_session.get_active_session_list(params)
        data_array = Util.get_dict_data(resp_data, 'ActiveSessionTimes')
      
        dates = []
        for iso_ts in data_array:
            print(iso_ts)
            date = datetime.strptime(iso_ts, '%H:%M:%S').strftime("%I:%M %p")
            dates.append(date)
           
        data = pd.DataFrame({'startTime':dates})   
       

        return build_response(Util.to_dict(data))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e) 

def list_bookable_itemsdew(event, context):


    try:
        sessiontype_id = Util.get_path_param(event, 'id')
        logger.debug(sessiontype_id)

        if not sessiontype_id:
            raise APIValidationError(
                'API Request is incomplete. Sessiontype_Id is required')
        params = {'sessiontypeIds': sessiontype_id, 'endDate': Util.get_default_end_date()}
       
        logger.debug('Retrieve BookableItem for Parameters {%s}', params)
        resp_data = active_session.get_active_session_list(params)
        data_array = Util.get_dict_data(resp_data, 'ActiveSessionTimes')
      
        dates = []
        for iso_ts in data_array:
            print(iso_ts)
            date = datetime.strptime(iso_ts, '%H:%M:%S').strftime("%I:%M %p")
            
            dates.append(date)
        data = pd.DataFrame({'startTime':dates})   
       
       
        logger.debug('Retrieve BookableItem for Parameters {%s}', params)
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
       

        merge_df = pd.merge(data,df1,left_on=['startTime'], right_on=['time'], how = 'left')
        columns = ['id','startTime','sessionId','sessionName','locationId','staffId','startDate','time','startisAM','startDateTime','endDate','endtime','endisAM']
        merge_df = Util.get_df_by_column(merge_df, columns)

        return build_response(Util.to_dict(merge_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)