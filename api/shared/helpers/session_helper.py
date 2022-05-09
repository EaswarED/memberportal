import jwt
from http import client
from shared.utilities.Util import Util
from shared.exceptions.exception import SecurityException


def get_client_id(event):
    claims = _get_claims(event)
    if claims:
        client_id = Util.get_dict_data(claims, "custom:MindbodyId")
        return int(client_id)
    else:
        #    raise SecurityException('No token present')
        return 100000032
    

def get_company_id(event):
    claims = _get_claims(event)
    if claims:
        company_id = Util.get_dict_data(claims, "custom:CompanyId")
        return int(company_id)
    else:
        return 100000006

def get_client_first_name(event):
    claims = _get_claims(event)
    if claims:
       first_name = Util.get_dict_data(claims, "given_name")
    return first_name

def get_client_email(event):
    claims = _get_claims(event)
    if claims:
       email_id = Util.get_dict_data(claims, "email")
    return  email_id


   

def get_param_value(event, str):
    return Util.get_dict_data(event["queryStringParameters"], str)


def get_path_value(event, str):
    return Util.get_dict_data(event["pathParameters"], str)

# # # # # # #
# DrChrono References
# # # # # # #
def get_patient_id(event):
    claims = _get_claims(event)
    if claims:
        patient_id = Util.get_dict_data(claims,"custom:ChronoId")
        return int(patient_id)
    else:
        #    raise SecurityException('No token present')
        return 102824711


# def get_patient_id(event):
#     # Dynamically retrieve the value from the Token
#     # return get_param_value(event, 'ClientId')
#     return 101523915    
def get_since_date(event):
    # Dynamically retrieve the value from the Token
    # return get_param_value(event, 'ClientId')
    return 2021-10-20

def get_doctor_id(event):
    # Dynamically retrieve the value from the Token
    # return get_param_value(event, 'ClientId')
    return 263299

def get_class_id(event):
    # Dynamically retrieve the value from the Token
    # return get_param_value(event, 'ClassId')
    return 22379

# # # # # # #
# Private Functions
# # # # # # #


def _get_claims(event):
    if event:
        token = event['headers']['Authorization']
        if token:
            token = token[7:]
            claims = jwt.decode(token, options={"verify_signature": False})
            return claims
        else:
            print('Token Not Present')
            req_context = event['requestContext']
            authorizer = Util.get_dict_data(req_context, "authorizer")
            if authorizer:
                claims = Util.get_dict_data(authorizer, "claims")
                return claims
    return None