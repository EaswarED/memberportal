from calendar import EPOCH
import pandas as pd
import numpy as np
import json
from datetime import datetime, date
from shared.utilities.Util import Util
from shared.utilities import constant
from shared.utilities.logger import get_logger
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_msg_response, build_response, build_security_response
from providers.dynamodb.modules import appt, db_class, form, client
from providers.drchrono.modules.patient import  clinical_note,patient_appt

logger = get_logger(__name__)

def get_appt_form_list(event, context):
    # appt_id ='20'
    appt_id = Util.get_path_param(event, 'id')
    patient_id = session_helper.get_patient_id(event)
    params = {
        'patient': patient_id ,'date' : Util.get_default_date()
        }
    return _get_form_list(event, appt_id, True,params)

def get_class_form_list(event, context):
    # class_id = '4'
    class_id = Util.get_path_param(event, 'id')
    return _get_form_list(event, class_id, False)


def submit_form(event, context):
    try:  
        req_data = json.loads(event['body'])
        print(req_data)
        client_id = session_helper.get_client_id(event)
        form_id = req_data['formId']
        form_data = req_data['formData']
        # Get Client Details
        profile = client.get_client(client_id)
        epoch_time = Util.get_current_epoch()
        forms = Util.get_dict_data(profile, 'Forms')

        if not forms:
            forms = {}
        forms[form_id] = epoch_time
        profile['Forms'] = forms
        result = client.save_client(client_id, profile)
        item = {
            'FormId': form_id,
            'Timestamp': epoch_time,    
        }
        result = client.save_activity(client_id, epoch_time, item)
        
        resp_data = clinical_note.create_clinical(json.dumps(form_data))
        print(resp_data)
        return build_msg_response('Form submitted successfully')

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def _get_form_list(event, target_id, is_appt,params={}):
    try:
        client_id = session_helper.get_client_id(event)
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
         raise APIValidationError(
            'API Request is incomplete. Patient_Id is required')
       
        # Get Valid Forms for the Appointment / Class
        if is_appt:
            item = appt.get_appt(target_id)
        else:
            item = db_class.get_class(target_id)
        forms = Util.get_dict_data(item, 'FormsList')
        print(forms)
        if not forms:
            return build_response([])
        list = form.list_form(constant.FORM_CLINICAL)
        id = ''
        if len(list)>0 and params:
            appts = list_patient_appts(params)
            print('aapt',appts)
            try:
                if appts:
                    id = appts[0]['id']
                    list = list
                else:
                    return build_msg_response([],"You dont have any appointment so not able to checkin at this time",200) 
            except Exception as e:
                print('Error: Patient ID', patient_id)
                print('Error: Event Object', event)
                print('Error: Appts Object', appts)
                print('Error: List Object', list)
                return build_msg_response([], "Development Error occured. Added this for debugging purpose. Create JIRA ticket", 200)

        list = list + form.list_form(constant.FORM_NON_CLINICAL)
        print(list)
        forms_df = pd.json_normalize(list)
        print(forms_df)
        forms_df = Util.filter_df(forms_df, forms, 'SK')
        forms_df.rename(columns={'SK': 'formId'}, inplace=True)
        forms_df.rename(columns={'Details.Name': 'name'}, inplace=True)
        forms_df.rename(columns={'Details.Validity': 'validity'}, inplace=True)
        forms_df['appointmentId']=id  
        # Get Client Submission Details
        profile = client.get_client(client_id)
        client_forms_list = Util.get_dict_data(profile, 'Forms')
        if client_forms_list:
            client_forms_df = Util.listmap_to_df(client_forms_list)
            merge_df = pd.merge(forms_df, client_forms_df, left_on=[
                'formId'], right_on=['id'], how="left")
            print(len(merge_df['value']))
            merge_df['submittedDt'] = ''
            for i in range(len(merge_df['value'])):
                print(i)
                if not pd.isnull(merge_df['value'].loc[i]):
                    merge_df['submittedDt'].loc[i] = datetime.fromtimestamp(
                        int(merge_df['value'].loc[i]))
                else:
                    merge_df['submittedDt'][i] = pd.NaT
            # merge_df['validity']=1

            now = datetime.now()
            dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
            merge_df['isValid'] = False
            print(merge_df['submittedDt'][0] +pd.DateOffset(minutes=5),merge_df['submittedDt'][0],dt_string)

            # merge_df = merge_df.replace({pd.NaT: ''})
            print(pd.isnull(merge_df["submittedDt"]))
            merge_df.loc[(merge_df['validity'] == -1) & (pd.isnull(merge_df["submittedDt"]) != True) & (datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S") < merge_df['submittedDt'][0] +
                                                                                                       pd.DateOffset(minutes=5)), 'isValid'] = True
            merge_df.loc[(merge_df['validity'] == 0) & (
                pd.isnull(merge_df["submittedDt"]) != True), 'isValid'] = False

            merge_df.loc[(merge_df['validity'] == 1) & (pd.isnull(merge_df["submittedDt"]) != True) & (datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S") < merge_df['submittedDt'][0] +
                                                                                                       pd.DateOffset(months=1)), 'isValid'] = True

            merge_df.loc[(merge_df['validity'] == 3) & (datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S") < merge_df['submittedDt'][0] +
                                                        pd.DateOffset(months=3)) & (pd.isnull(merge_df["submittedDt"]) != True), 'isValid'] = True

            merge_df.loc[(merge_df['validity'] == 6) & (datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S") < merge_df['submittedDt'][0] +
                                                        pd.DateOffset(months=6)) & (pd.isnull(merge_df["submittedDt"]) != True), 'isValid'] = True

            merge_df.loc[(merge_df['validity'] == 12) & (datetime.strptime(dt_string, "%Y-%m-%d %H:%M:%S") < merge_df['submittedDt'][0] +
                                                         pd.DateOffset(months=12)) & (pd.isnull(merge_df["submittedDt"]) != True), 'isValid'] = True

            merge_df.fillna('', inplace=True)
            merge_df['submittedDt'] = merge_df['submittedDt'].astype(str)
        else:
            merge_df = forms_df
            merge_df.insert(0, 'isValid', False)
            merge_df.insert(0, 'submittedDt', '')

        columns = ['formId', 'name', 'submittedDt', 'isValid','appointmentId']
        final_df = Util.get_df_by_column(merge_df, columns)

        return build_response(Util.to_dict(final_df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)

def list_patient_appts(params):
    try:
        
        logger.debug('Retrieve Patient Appointments for Parameters {%s}', params)
        resp_data = patient_appt.get_appointment_list(params)
    
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['id','doctor','patient']
        df = Util.get_df_by_column(df, columns)
        return Util.to_dict(df)
       

    except SecurityException as e:
        return build_security_response({}, e)       
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)
