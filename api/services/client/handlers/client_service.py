import datetime
from this import d
import socket
import pandas as pd
import json
from datetime import datetime as date
from cerberus import Validator
from providers.sendgrid.helpers.email_helper import send_template_email
from shared.helpers.api_helper import  build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.client import client_service,add_clients,update_clients,client_pur,get_client,login_client,client_member
from providers.mindbody.modules.sale import sales
from shared.helpers import session_helper
from shared.utilities import constant
from shared.exceptions.exception import APIValidationError, SecurityException
from schemas import notification_schemas
from providers.dynamodb.modules import client,company

logger = get_logger(__name__)

def list_client_services(event, context):
    # sessiontype_id ='22'
    sessiontype_id = Util.get_path_param(event, 'id')
    client_id = session_helper.get_client_id(event)
    if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')
    params = {'clientId': client_id,'sessiontypeid': sessiontype_id}
    return _services(params,event)

def client_class_services(event, context):
    # class_id ='339'
    class_id = Util.get_path_param(event, 'id')
    client_id = session_helper.get_client_id(event)
    if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')
    params = {'clientId': client_id,'ClassId' :class_id}
    return _services(params,event)


def _services(params,event):
    try:
        client_id = session_helper.get_client_id(event)
        logger.debug('Retrieve client services {%s}', params)
        
        resp_data = client_service.get_client_service(params)
        data = Util.get_dict_data(resp_data, 'ClientServices')

        if len(data) == 0:
            df = pd.DataFrame()
            df['ServiceId'] = ''
            df['Name'] = ''
            df['Count'] = ''
            df['Remaining']=''
        else:
     
            df = pd.DataFrame(data)
            df.rename (columns={'Id':'ServiceId'},inplace=True)
            columns = ['Count','ServiceId','Remaining','Name','MembershipId']
            df = Util.get_df_by_column(df, columns)
            print(df)
        
        client_df = client_member.view_client_membership(params={'clientId': client_id})
        data = Util.get_dict_data( client_df, 'ClientMemberships')
        member_df = pd.DataFrame(data) 
        member_df.rename (columns={'Name':'Mname'},inplace=True)
        member_df.rename (columns={'Count':'MCount'},inplace=True)
        member_df.rename (columns={'Remaining':'MRemaining'},inplace=True)
        columns = ['MembershipId','MCount','Id','Mname','MRemaining']   
        member_df = Util.get_df_by_column(member_df, columns)
        # print('ll',member_df)       
        final_df = pd.merge(member_df,df, left_on ='Id', right_on='ServiceId', how = 'right')
        columns = ['Count','Id','Remaining','Name','MembershipId','MCount','Mname','MRemaining']
        final_df["Name"] = final_df["Mname"].fillna(final_df["Name"])
        final_df["Count"] = final_df["MCount"].fillna(final_df["Count"])
        final_df["Remaining"] = final_df["MRemaining"].fillna(final_df["Remaining"])
        final_df1 = Util.get_df_by_column(final_df, columns)
     
        return build_response(Util.to_dict(final_df1))

    except SecurityException as e:
        return build_security_response([], e)              
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
        
def add_client(event, context):
    try:
        logger.debug('Request Body: %s', event)
         
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        item ={  
            'FirstName':req_data['firstName'],
            'LastName':req_data['lastName'],
            'Gender':req_data['gender'],
            'Email':req_data['email'],
            'BirthDate':req_data['birthDate'],
            'AddressLine1':req_data['addressLine1'],
            'City':req_data['city'],
            'State':req_data['state'],
            'Country':req_data['country'],
            'PostalCode':req_data['postalCode'],
            'MobilePhone':req_data['mobilePhone'],
            'LiabilityRelease':req_data['liabilityRelease'],
            'SendAccountEmails':req_data['sendAccountEmails'],
            'Test':req_data['test']
            }
        resp_data = get_client.get_view_client({})
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.json_normalize(resp_data)
        df = df.loc[df['Email'] == req_data['email']]
        columns = ['Id', 'FirstName', 'LastName', 'Email', 'HomePhone', 'MobilePhone',
                   'AddressLine1', 'City', 'State', 'Country', 'PostalCode', 'Gender']
        df = Util.get_df_by_column(df, columns)
        print("before if", df)
        if df.empty:
            resp_data = add_clients.create_client(json.dumps(item))
            logger.debug('Request created: {%s}', resp_data)
            resp_data = Util.get_dict_data(resp_data, 'Client')
            df = pd.json_normalize(resp_data)
            df = Util.get_df_by_column(df, columns)

            client_id = (df.iloc[0]['Id'])
            client_id = int(client_id)
            client_df = client.save_client(client_id, {'PendingGroups': [], 'ApprovedGroups': [],'DeniedGroups': [], 'Forms': {}, 'Freebie': constant.FREEBIE,'FreebieCancelledOn':""})
            print("if", df)
        print("if outside", df)
        hostname = socket.gethostname()
        IPAddr = socket.gethostbyname(hostname)
        message_data = {
            "clientId": df.iloc[0]['Id'],
            "name": df.iloc[0]['FirstName']+df.iloc[0]['LastName'],
            "email": df.iloc[0]['Email'],
            "phoneHome": df.iloc[0]['HomePhone'],
            "phoneMobile": df.iloc[0]['MobilePhone'],
            "address": df.iloc[0]['AddressLine1'],
            "city": df.iloc[0]['City'],
            "state": df.iloc[0]['State'],
            "country": df.iloc[0]['Country'],
            "postal": df.iloc[0]['PostalCode'],
            "gender": df.iloc[0]['Gender'],
            "ipAddress": IPAddr
        }
        send_template_email(constant.ADMIN_EMAIL,
                            constant.EMAIL_TEMPLATE_REQUEST_TO_ADMIN, message_data)

        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def update_client(event, context):

    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
        item = {
            "Client": {
                "BirthDate": req_data['birthDate'],
                "Id": req_data['id'],
                'FirstName': req_data['firstName'],
                "Country": req_data['country'],
                "State":  req_data['state'],
                "Email": req_data['email'],
                "MobilePhone": req_data['mobilePhone'],
                "AddressLine1": req_data['addressLine1'],
                "City": req_data['city'],
                "PostalCode": req_data['postalCode'],
                "SendAccountEmails": req_data['sendAccountEmails'],
                "Gender": req_data['gender'],
                "ClientRelationships": [{"RelatedClientId": req_data['companyId'], "Relationship": {"Id": 4}, "RelationshipName": "Company"}]
            },
            "SendEmail": True,
            "CrossRegionalUpdate": req_data['crossRegionalUpdate'],
            "Test": req_data['test']
        }

        resp_data = update_clients.get_update_client(json.dumps(item))
        resp_data = Util.get_dict_data(resp_data, 'Client')
        df = pd.json_normalize(resp_data)
        columns = ['Id', 'FirstName', 'LastName', 'Email', 'HomePhone', 'MobilePhone',
                   'AddressLine1', 'City', 'State', 'Country', 'PostalCode', 'Gender', 'ClientRelationships']
        df = Util.get_df_by_column(df, columns)
        # Save Client to DB
        client_id = (df.iloc[0]['Id'])
        client_id = int(client_id)
        client_df = client.save_client(client_id, {'PendingGroups': [], 'ApprovedGroups': [], 'DeniedGroups': [
        ], 'Forms': {}, 'Freebie': constant.FREEBIE, 'CompanyId': req_data['companyId'], 'FreebieCancelledOn': ""})

        hostname = socket.gethostname()
        IPAddr = socket.gethostbyname(hostname)
        company_id_data = company.get_company(
            df.iloc[0, :]['ClientRelationships'][0]['RelatedClientId'])

        message_data = {
            "clientId": df.iloc[0]['Id'],
            "name": df.iloc[0]['FirstName']+df.iloc[0]['LastName'],
            "email": df.iloc[0]['Email'],
            "phoneHome": df.iloc[0]['HomePhone'],
            "phoneMobile": df.iloc[0]['MobilePhone'],
            "address": df.iloc[0]['AddressLine1'],
            "city": df.iloc[0]['City'],
            "state": df.iloc[0]['State'],
            "country": df.iloc[0]['Country'],
            "postal": df.iloc[0]['PostalCode'],
            "gender": df.iloc[0]['Gender'],
            "companyId": df.iloc[0, :]['ClientRelationships'][0]['RelatedClientId']+' - ' + company_id_data['Details']['Name']+' - ' + company_id_data['Details']['Code'],
            "ipAddress": IPAddr
        }
        print('ll', message_data)

        send_template_email(constant.ADMIN_EMAIL,
                            constant.EMAIL_TEMPLATE_REQUEST_TO_CLIENT, message_data)

        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Notification
def notification(event, context):
    try:   
        req_data = event['body']
        logger.debug('Request Body: %s', req_data)

        validator = Validator(notification_schemas.NotificationPOSTSchema,
                          purge_readonly=True)  
        if not validator.validate(req_data):
               raise APIValidationError(Util.to_str(validator.errors))
        if req_data:
                req_data = json.dumps(req_data)   
        resp_data= update_client.get_update_client(req_data)
        resp_data = Util.get_dict_data(resp_data, 'Client')

        df= pd.json_normalize(resp_data)
        columns = ['Id','SendAccountEmails','SendScheduleEmails','SendScheduleTexts']
        df = Util.get_df_by_column(df, columns)
        return build_response(Util.to_dict(df)) 
    except SecurityException as e:
        return build_security_response({}, e)    
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Client Purchase
def client_purchases(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        if not client_id:
            raise APIValidationError(
                'API Request is incomplete. Client_Id is required')
        params = {'clientId': client_id}
        logger.debug('Retrieve client details {%s}', params)
        
        resp_data = client_pur.get_client_purchase(params)
        resp_data = Util.get_dict_data(resp_data, 'Purchases')
        
        df= pd.json_normalize(resp_data)
        columns= ['Sale.SaleDate','Description','Quantity','Sale.Payments','AmountPaid']
        
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

# Get Clients******
def view_client(event,context):
    try:
        client_id = Util.get_path_param(event, 'id')
        # client_id = '100000032'
        params = {'clientIds': client_id}
        logger.debug('Retrieve client details {%s}', params)
        resp_data = get_client.get_view_client(params)
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.json_normalize(resp_data)
        columns = ['FirstName','LastName','BirthDate','Id','Country','State','Email','MobilePhone','ClientRelationships','AddressLine1','City','PhotoUrl','PostalCode','Gender','SendAccountEmails','SendAccountTexts']
        df = Util.get_df_by_column(df, columns)
        data_resp = Util.to_dict(df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp)
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

def get_data(event, context):
    json_file = 'data/check_in'
    json_file = json_file + ".json"

    with open(json_file, 'r') as file_obj:
        json_data = json.load(file_obj)
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(json_data),
    }


def join_now(event, context):
    json_file = 'data/join_now'
    json_file = json_file + ".json"

    with open(json_file, 'r') as file_obj:
        json_data = json.load(file_obj)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(json_data),
    }

# Get Clients Based on Lastname******
def client_search(event, context):
    try:
        searchText = Util.get_path_param(event, 'searchText')
        #searchText = "Test"
        if not searchText:
            searchText={}
        params = {'SearchText': searchText}
        logger.debug('Retrieve client details {%s}', params)
        
        resp_data = get_client.get_view_client(params)
        resp_data = Util.get_dict_data(resp_data, 'Clients')
        df = pd.DataFrame(Util.to_lower_key(resp_data))
        columns = ['firstName','lastName','birthDate','id','country','state','email','mobilePhone','addressLine1','city','postalCode','gender','sendAccountEmails','sendAccountTexts']
       
        df = Util.get_df_by_column(df, columns)
        data_resp = Util.to_dict(df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp)
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)

#Login
def login(event, context):
    try:   
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)

        items={
            "Username":req_data['username'],
            "Password":req_data["password"]
        } 
        resp_data= login_client.login_detail(json.dumps(items))
        
        return build_response({"data":resp_data}) 

    except SecurityException as e:
        return build_security_response({}, e)     
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

def purchase_details(event, context):
    try:   
        params={}
        resp_data= sales.get_sale_details(params)
        resp_data = Util.get_dict_data(resp_data, 'Sales')
        df = pd.json_normalize(resp_data)
        columns =['SaleDate','ClientId','PurchasedItems','Payments']
        df = Util.get_df_by_column(df, columns)
        data_resp = Util.to_dict(df)
        if data_resp:
            data_resp = data_resp
        else:
            data_resp = []
        return build_response(data_resp)

    except SecurityException as e:
        return build_security_response({}, e)     
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

