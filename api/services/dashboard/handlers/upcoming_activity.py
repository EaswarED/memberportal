import numpy as np
import pandas as pd
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from shared.utilities import constant
from providers.mindbody.modules.client import client_visit
from providers.mindbody.modules.classes import classes,class_description
from providers.mindbody.modules.staff import staff
from providers.mindbody.modules.site import session_type
from providers.dynamodb.modules import appt,db_class,client
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)


def list_client_visit(event, context):
    try:

        client_id = session_helper.get_client_id(event)
        dyn_data = client.get_client(client_id)
        dyn_df = pd.json_normalize(dyn_data)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')

        params = {
            'clientId': client_id,
            'endDate': Util.get_default_end_date()
        }
        logger.debug('Retrieve client visit {%s}', params)

        resp_data = client_visit.get_client_visit(params)
        data = Util.get_dict_data(resp_data, 'Visits')
        print("data", data)
        if len(data) == 0:
            return build_response(data)

        visit_df = pd.DataFrame(data)
        visit_df.rename(
            columns={'Id': 'VisitId'}, inplace=True)
        columns = ['AppointmentId', 'ClassId', 'Name', 'StartDateTime', 'EndDateTime', 'VisitId',
                   'StaffId', 'VisitType', 'AppointmentStatus', 'SignedIn', 'MakeUp', 'ClientId']
        visit_df = Util.get_df_by_column(visit_df, columns)
        # Staff
        staff_df = staff.get_staff_df()

        # Merging of Visit & Staff
        merged_df = pd.merge(staff_df, visit_df, left_on=[
                             "StaffId"], right_on=["StaffId"])

        # Retrieve All Mindbody Classes
        params = {'endDateTime': Util.get_default_end_date()}
        resp_data = classes.get_class_list(params)
        data = Util.get_dict_data(resp_data, "Classes")
        class_df = pd.json_normalize(data)
        class_df.rename(
            columns={'ClassDescription.Id': 'DescriptionId'}, inplace=True)
        class_df.rename(
            columns={'Id': 'ClassId'}, inplace=True)

        columns = ['DescriptionId', 'ClassId']
        class_df = Util.get_df_by_column(class_df, columns)

        # Merging of Visit & Staff
        merged_df1 = pd.merge(merged_df, class_df, left_on=[
            "ClassId"], right_on=["ClassId"], how='outer')
        # Session
        session_df = session_type.get_session_type_df()

        # Merging of Visit & Session
        merged_df2 = pd.merge(merged_df1, session_df, left_on=[
            "VisitType"], right_on=["SessionTypeId"], how="inner")

        # Merging of Visit & class
        final_df = pd.merge(visit_df, merged_df2, left_on=[
            "VisitType", "Name"], right_on=["VisitType", "Name"], how='inner')

        final_df.rename(columns={'VisitType': 'Id'}, inplace=True)
        final_df.rename(columns={'StaffId_x': 'StaffId'}, inplace=True)
        final_df.rename(
            columns={'AppointmentId_x': 'AppointmentId'}, inplace=True)
        final_df.rename(columns={'ClassId_x': 'ClassId'}, inplace=True)
        final_df.rename(
            columns={'StartDateTime_x': 'StartDateTime'}, inplace=True)
        final_df.rename(columns={'EndDateTime_x': 'EndDateTime'}, inplace=True)
        final_df.rename(
            columns={'AppointmentStatus_x': 'AppointmentStatus'}, inplace=True)
        final_df.rename(columns={'VisitId_x': 'VisitId'}, inplace=True)
        final_df.rename(columns={'SignedIn_x': 'SignedIn'}, inplace=True)
        final_df.rename(columns={'MakeUp_x': 'MakeUp'}, inplace=True)
        final_df.rename(columns={'ClientId_x': 'ClientId'}, inplace=True)
        final_df.loc[final_df['AppointmentId'] > 0,
                     'BookingId'] = final_df['AppointmentId']
        final_df.loc[final_df['ClassId'] > 0,
                     'BookingId'] = final_df['ClassId']
        columns = ['VisitId', 'Id', 'Name', 'Type', 'StaffId', 'BookingId', 'StartDateTime',
                   'EndDateTime', 'AppointmentStatus', 'DescriptionId', 'StaffName', 'SignedIn', 'MakeUp', 'ClientId']
        final_df = Util.get_df_by_column(final_df, columns)
        # final_df.to_csv("C:\\SHAS\\test.csv")

        final_df = final_df.drop_duplicates(
            subset=['BookingId'], keep='last')
        # print('ll', final_df)

        result = appt.list_appt()
        # print(result)
        dynodb_df = pd.json_normalize(result)
        dynodb_df['SK'] = dynodb_df['SK'].astype('int64')

        # Merge Data
        merge_df = pd.merge(final_df, dynodb_df, left_on=[
            'Id'], right_on=['SK'], how="left")
        merge_df.rename(
            columns={'Details.CategoryId': 'CategoryId'}, inplace=True)
        columns = ['VisitId', 'CategoryId', 'Id', 'Name', 'Type', 'StaffId', 'BookingId', 'StartDateTime',
                   'EndDateTime', 'AppointmentStatus', 'DescriptionId', 'StaffName', 'SignedIn', 'MakeUp', 'ClientId']
        merge_df = Util.get_df_by_column(merge_df, columns)
        # print('mm', merge_df)
        # merge_df.to_csv("C:\\SHAS\\test1.csv")

        # Retrieve All Mindbody Classes
        resp_data = class_description.get_class_description(params)
        data = Util.get_dict_data(resp_data, "ClassDescriptions")
        class_df = pd.json_normalize(data)
        class_df.rename(
            columns={'SessionType.Id': 'SessionTypeId'}, inplace=True)
        class_df.rename(
            columns={'Name': 'Descname'}, inplace=True)
        class_df.rename(
            columns={'Id': 'DescId'}, inplace=True)
        columns = {'SessionTypeId', 'Descname', 'DescId'
                   }
        class_df = Util.get_df_by_column(class_df, columns)

        final_df2 = pd.merge(class_df, merge_df, left_on=[
            'SessionTypeId', 'Descname'], right_on=['Id', 'Name'], how="right")
        # final_df2.to_csv("C:\\SHAS\\test2.csv")

       # Retrieve Db class list
        dynodf = db_class.list_class()
        dynodf['SK'] = dynodf['SK'].astype('int64')
        # print('dbdbdb', dynodf)

        final_merge = pd.merge(dynodf, final_df2, left_on=[
                               'SK'], right_on=['DescId'], how='right')
        columns = ['VisitId', 'CategoryId', 'Details.CategoryId', 'Id', 'Name', 'Type', 'StaffId', 'BookingId',
                   'StartDateTime', 'EndDateTime', 'AppointmentStatus', 'DescriptionId', 'StaffName', 'SignedIn', 'MakeUp', 'ClientId']
        final_merge = Util.get_df_by_column(final_merge, columns)
        final_merge["CategoryId"] = final_merge["CategoryId"].fillna(
            final_merge["Details.CategoryId"])

        # Retrieve Db group list
        dynodf1 = db_class.list_group()
        dynodf1['SK'] = dynodf1['SK'].astype('int64')
        # dynodf1.to_csv("C:\\SHAS\\test.csv")

        final_merge1 = pd.merge(dynodf1, final_merge, left_on=[
                                'SK'], right_on=['DescriptionId'], how='right')
        columns = ['VisitId', 'CategoryId', 'Details.CategoryId_x', 'Details.CategoryId_y', 'Id', 'Name', 'Type', 'Details.Type',
                   'StaffId', 'BookingId', 'StartDateTime', 'EndDateTime', 'AppointmentStatus', 'DescriptionId', 'StaffName', 'SignedIn', 'MakeUp', 'ClientId']
        final_merge1 = Util.get_df_by_column(final_merge1, columns)
        final_merge1["CategoryId"] = final_merge1["CategoryId"].fillna(
            final_merge1["Details.CategoryId_x"])
        final_merge1.loc[final_merge1['Details.Type'] == 'G',
                         'Type'] = 'Group'
        final_merge1['ClientId'] = final_merge1['ClientId'].fillna(0)
        final_merge1['ClientId'] = final_merge1['ClientId'].astype('int64')
        final_df1_merged = pd.merge(final_merge1, dyn_df, left_on=[
                                    'ClientId'], right_on=['PK'], how='outer')
        columns = ['VisitId', 'CategoryId', 'Details.CategoryId_x', 'Details.CategoryId_y', 'Id', 'Name', 'Type', 'Details.Type',
                   'StaffId', 'BookingId', 'StartDateTime', 'EndDateTime', 'AppointmentStatus', 'DescriptionId', 'StaffName', 'SignedIn', 'MakeUp', 'ClientId', 'Freebie']
        final_df1_merged = Util.get_df_by_column(final_df1_merged, columns)
        # print("final_df1_merged", final_df1_merged)

        return build_response(Util.to_dict(final_df1_merged))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)