import pandas as pd
import json

from sqlalchemy import false
from cerberus import Validator
from shared.helpers.api_helper import build_response, build_custom_err_response, build_err_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.mindbody.modules.sale import appt_cc
from shared.helpers import session_helper
from shared.exceptions.exception import APIValidationError, SecurityException
from schemas import book_schema,add_class,book_enroll
logger = get_logger(__name__)

def book_appts(event, context):
    try:
        
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
              
        validator = Validator(book_schema.BuyandBookPOSTSchema,
                           purge_readonly=True)

        if not validator.validate(req_data):
            raise APIValidationError(Util.to_str(validator.errors))

        if req_data:
            req_data = json.dumps(req_data)

        print(req_data)
        resp_data= appt_cc.buy_appointment_cc(req_data)
        logger.debug('Request created: {%s}', resp_data)

        resp_data = Util.get_dict_data(resp_data, 'Appointments')
        df= pd.json_normalize(resp_data)
        columns = ['Id','StartDateTime','EndDateTime','SessionTypeId']
        df = Util.get_df_by_column(df, columns)
        logger.debug('Request Body: %s', req_data)

        return build_response(Util.to_dict(df)) 
        

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Book Class
def book_class(event, context):
    try:
        
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)
              
        validator = Validator(add_class.BuyandClassPOSTSchema,
                           purge_readonly=True)

        if not validator.validate(req_data):
            raise APIValidationError(Util.to_str(validator.errors))

        if req_data:
            req_data = json.dumps(req_data)

        resp_data= appt_cc.buy_appointment_cc(req_data)
        logger.debug('Request created: {%s}', resp_data)

        resp_data = Util.get_dict_data(resp_data, 'Classes')
        df= pd.json_normalize(resp_data)

        df.rename(columns = {'ClassDescription.SessionType.Id':'SessionTypeId'}, inplace = True)
        columns = ['Id','StartDateTime','EndDateTime','SessionTypeId']
        df = Util.get_df_by_column(df, columns)
        logger.debug('Request Body: %s', req_data)

        return build_response(Util.to_dict(df)) 
        

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

#Purchase Membership
def purchase_membership(event, context):
    try:
        
        client_id = session_helper.get_client_id(event)
        # req_data = json.loads(event['body'])
        
        req_data = '"client_id":100000007,"test": "false","Items":[{"Item":{"type":"Service","Metadata":{"staffId":9,"serviceId":100042}},"quantity":1,}],"Payments":[{"paymenttype": "Cash","Metadata":{"amount":0}}],"locationId": 1'
        logger.debug('Request Body: %s', req_data)
        item={
            "ClientId": client_id,
            "Test": req_data['test'],
            "Items": [
                {
                    "Item": {
                    "Type": req_data['type'],
                    "Metadata": {
                        "Id" :req_data['serviceId'],
                        "StaffId":req_data['staffId']
                        }
                   
                },
                "Quantity":req_data['quantity'],
                        
                }
            ],
           
            "Payments": [
                {
                "Type": req_data['paymenttype'],
                "Metadata": {
                    
                    "Amount": req_data['amount']
                    
      	            
                }
                }
            ],
            
            "LocationId": req_data['locationId']
        }    
        
        resp_data= appt_cc.buy_appointment_cc(json.dumps(item))
        logger.debug('Request created: {%s}', resp_data)
        
        return build_response(resp_data,status_code=200)
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)