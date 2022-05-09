from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
import pandas as pd
import json
from cerberus import Validator
from shared.helpers import session_helper
from shared.common import companies
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.drchrono.modules.patient import add_allergy,add_patient,allergy,patient,medication,add_medication,add_problem,problem,access_create,template,clinical_note,message,doctor,clinical_form
from schemas import access_schema,clinical_schema

logger = get_logger(__name__)

def list_patient(event, context):
    try:
        doctor_id = session_helper.get_doctor_id(event)
        if not doctor_id:
            raise APIValidationError(
                'API Request is incomplete. Doctor_Id is required')

        params = {
            'doctor': doctor_id
        }

        logger.debug('Retrieve Patient list for Parameters {%s}', params)

        resp_data = patient.get_patient_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.DataFrame(data)
        columns = ['id','first_name', 'last_name','date_of_birth','gender','social_security_number','race','ethnicity','preferred_language','patient_photo','home_phone','email','address','city','state','zip_code','emergency_contact_name','emergency_contact_phone','office_phone']
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

# Add Patient
def add_patients(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        # if req_data:
        #      req_data = json.dumps(req_data)
        items={
            "date_of_birth":req_data['date_of_birth'],
            "doctor":req_data['doctor'],
            "email":req_data['email'],
            "first_name":req_data['first_name'],
            "last_name":req_data['last_name'],
            "gender":req_data['gender'],
            "home_phone": req_data['home_phone'],
            "work_phone": req_data['work_phone'],
            "country":req_data['country'],
            "race":req_data['race'],
            "ethinicity":req_data['ethinicity'],
            "preferred_language":req_data['preferred_language'],
            "social_security":req_data['social_security'],
            "emergency_contact_name":req_data['emergency_contact_name'],
            "emergency_contact_phone":req_data['emergency_contact_phone']
            }
        resp_data= add_patient.add_patient_list(json.dumps(items))

        return build_response(resp_data) 
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Allergy list

def list_allergies(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. Patient_Id is required')

        params = {
            'patient': patient_id
        }

        logger.debug('Retrieve Patient Allergies for Parameters {%s}', params)

        # TODO: Modify this code after gettiing updates on the RefreshToken question
        resp_data = allergy.get_allergy_list(params)
        data = Util.get_dict_data(resp_data, 'results')

        return build_response(data)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)



#Add Allergy

def add_allergies(event, context):
    try:
        req_data = json.loads(event['body'])
        print(req_data)
        logger.debug('Request Body: %s', req_data)
        item ={
            'description':req_data['description'],
            'doctor':req_data['doctor'],
            'patient':req_data['patient'],
            'reaction':req_data['reaction'],
            'rxnorm':req_data['rxnorm'],
            'snomed_reaction':req_data['snomed_reaction'],
        }
        resp_data= add_allergy.add_allergy_list(json.dumps(item))
        return build_response(resp_data) 
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Medication List
def list_medications(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. Patient_Id is required')
        params = {
            'patient': patient_id
        }
        logger.debug('Retrieve Patient Medications for Parameters {%s}', params)
        resp_data = medication.get_medication_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['id','doctor', 'indication','notes','dosage_quantity']
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)
#Add Medications
def add_medications(event, context):
    try:
        req_data = json.loads(event['body'])
        print(req_data)
        logger.debug('Request Body: %s', req_data)
        item ={
            'doctor':req_data['doctor'],
            'patient':req_data['patient'],
            'dosage_quantity':req_data['dosage_quantity'],
            'indication':req_data['indication'],
            'rxnorm':req_data['rxnorm'],
            'notes':req_data['notes'],
            }

        resp_data= add_medication.add_medication_details(json.dumps(item))

        return build_response(resp_data) 

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
#Add Problem
def add_problems(event, context):
    try:
        req_data = json.loads(event['body'])
        print(req_data)
        logger.debug('Request Body: %s', req_data)
        item ={
           
            'doctor':req_data['doctor'],
            'patient':req_data['patient'],
            'name':req_data['name'],
            'notes':req_data['notes'],
            'icd_code':req_data['icd_code'],
            'date_diagnosis':req_data['date_diagnosis'],
            }
        resp_data= add_problem.add_problem_list(json.dumps(item))

        return build_response(resp_data) 

    except SecurityException as e:
        return build_security_response({}, e)   
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
#Problem List

#Medication List
def list_problems(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. Patient_Id is requiired')
        params = {
            'patient': patient_id
        }
        logger.debug('Retrieve Patient Problems for Parameters {%s}', params)

        resp_data = problem.get_problem_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['id','doctor', 'patient','notes','name','date_diagnosis','icd_code']
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#OnPatient Access
def create_Onpatient(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
  
        validator = Validator(access_schema.PatientAccessPOSTSchema,
                           purge_readonly=True)
        if not validator.validate(req_data):
            raise APIValidationError(Util.to_str(validator.errors))

        if req_data:
             req_data = json.dumps(req_data)
        resp_data= access_create.on_patient_create(req_data)

        return build_response(resp_data)

    except SecurityException as e:
        return build_security_response({}, e)    
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

# Get Template list
def list_templates(event, context):
    try:
        params = {}
        logger.debug('Retrieve all templates list for Parameters {%s}', params)
        resp_data = template.get_template_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.DataFrame(Util.to_lower_key(data))
        columns = ['id','name','doctor']
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#Create clinical_note_field_values for the Patient

def create_form(event, context):
    
    try:
        
        req_data = json.loads(event['body'])      
        logger.debug('Request Body: %s', req_data)
  
        validator = Validator(clinical_schema.ClinicalNotePOSTSchema,
                           purge_readonly=True)
        if not validator.validate(req_data):
            raise APIValidationError(Util.to_str(validator.errors))

        if req_data:
             req_data = json.dumps(req_data['data'])
        resp_data= clinical_note.create_clinical(req_data)

        return build_response(resp_data)

    except SecurityException as e:
        return build_security_response({}, e)     
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Doctors list
def list_doctors(event, context):
    try:
        params={}
        logger.debug('Retrieve Doctors list for Parameters {%s}', params)

        resp_data = doctor.get_doctor_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        df = pd.json_normalize(data)
        columns = ['id','first_name','last_name']
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


#Messages
def list_messages(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. Patient_Id is required')
        params = {}
        logger.debug('Retrieve Patient messages for Parameters {%s}', params)
    
        resp_data = doctor.get_doctor_list(params)
        data = Util.get_dict_data(resp_data, 'results')
        if len(data)>0:
            df1 = pd.json_normalize(data)
            df1.rename(columns = {'id':'doctor_id'}, inplace = True)
            columns = ['doctor_id','first_name','last_name']
            df1 = Util.get_df_by_column(df1, columns)
            df1['fullname'] = df1['first_name'] + ' ' + df1['last_name']

            resp_data = message.get_message_list(params)
            data = Util.get_dict_data(resp_data, 'results')
            df = pd.json_normalize(data,record_path='message_notes',meta=['id','received_at','doctor'])
            df.rename(columns = {'text':'messages'}, inplace = True)
            columns = ['id','received_at','doctor','created_by','messages']
            df = Util.get_df_by_column(df, columns)

            #doctor Name
            merged_df = pd.merge(df,df1, left_on=["doctor"], right_on=["doctor_id"], how="inner")
            columns = ['id','received_at','created_by','messages','first_name','last_name','fullname']
            merged_df = Util.get_df_by_column(merged_df, columns)

            return build_response(Util.to_dict(merged_df))
        else:
            return build_response(data)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def list_allergies(event, context):
    try:
        patient_id = session_helper.get_patient_id(event)
        if not patient_id:
            raise APIValidationError(
                'API Request is incomplete. PatientId is required')
        params = {
            'patient': patient_id
        }
        logger.debug('Retrieve Patient Allergies for Parameters {%s}', params)  
        resp_data = clinical_form.get_clinical(params)
        data = Util.get_dict_data(resp_data, 'results')
        # columns =['id']
        return build_response(data)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def list_register(event,context):
    try:
       resp_data = companies.register_company(event,context)
       return resp_data

    except SecurityException as e:
            return build_security_response([], e)
    except APIValidationError as e:
            return build_custom_err_response([], e)
    except Exception as e:
            return build_err_response([], e)
 
