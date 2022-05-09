import pandas as pd
import json
from cerberus import Validator
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.client import client_visit
from providers.mindbody.modules.staff  import staff
from providers.mindbody.modules.site  import session_type
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError

logger = get_logger(__name__)

def enroll_visits(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        params = {'clientId': client_id}   
        start_dt = session_helper.get_start_dt(event)
        end_dt = session_helper.get_end_dt(event) 
        if start_dt:
            params['startDate'] = start_dt

        if end_dt:
            params['endDate'] = end_dt
        logger.debug('Retrieve client visit {%s}', params)

        resp_data = client_visit.get_client_visit(params)
        data = Util.get_dict_data(resp_data, 'Visits')
        visit_df = pd.DataFrame(Util.to_lower_key(data))
        visit_df.rename(columns = {'name':'enrollName'}, inplace = True)
        visit_df.rename(columns = {'id':'visitid'}, inplace = True)
        columns = ['classId','visitid','enrollName','startDateTime', 'endDateTime','visitType','appointmentStatus','staffId']
        visit_df = Util.get_df_by_column(visit_df, columns)
        visit_df = visit_df[visit_df['classId']>0]

        #session
        resp_data = session_type.get_session_type_list(params)
        data = Util.get_dict_data(resp_data, 'SessionTypes')
        session_df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['id','name','type']
        session_df = Util.get_df_by_column(session_df, columns)

        merg_df = pd.merge(visit_df,session_df, left_on=["visitType"], right_on=["id"],  how="inner")
        columns = ['visitType','classId','enrollName','startDateTime','appointmentStatus','staffId','type','visitid']
        merg_df = Util.get_df_by_column(merg_df, columns)
        merg_df = merg_df[merg_df['type']=='Classes']

        #staff
        params = {'limit': 200} 
        resp_data = staff.get_staff_list(params)
        data = Util.get_dict_data(resp_data, 'StaffMembers')
        staff_df = pd.DataFrame(Util.to_lower_key(data))
        staff_df.rename(columns = {'name':'staffName'}, inplace = True)

        merged_df = pd.merge(staff_df,merg_df, left_on=["id"], right_on=["staffId"])
        columns = ['classId','enrollName','staffName','startDateTime','appointmentStatus','visitid', 'visitType','staffId']
        merged_df = Util.get_df_by_column(merged_df, columns)
     
        return build_response(Util.to_dict(merged_df))

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
