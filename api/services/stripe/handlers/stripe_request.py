import json
import os
import stripe
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.utilities.logger import get_logger
from providers.dynamodb.modules import pay

from flask import Flask, redirect

from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_response, build_security_response
from shared.helpers import session_helper

app = Flask(__name__)

stripe.api_key = 'sk_test_51KMd2zEUXzQXmhuYsFN56Zqvarsseimu7DAe34mrmByMQ9LnE8k4Cobv5CQzn4Pc8VplZqjQB1a7TY8t5hYTX4A600mOcG45vf'

def stripe_request (event,context):
    try:

        client_id = session_helper.get_client_id(event)
        req_data=json.loads(event['body'])
        print(req_data)
        item =[{
        "price_data": {
            "currency": "usd",
            "product_data": {
                "name": "Mindworx Services"
            },
            "unit_amount": int(req_data['Amount']) * 100
        },
	    "quantity": 1
        }]
        session = stripe.checkout.Session.create(
        line_items= item,
        mode='payment',
        success_url= 'https://memberportal-dev.yourmindworx.com/#/stripe/payment/{CHECKOUT_SESSION_ID}',
        cancel_url= 'https://memberportal-dev-api.yourmindworx.com/stripe/error'
     
        )
        print(session)
        data={
           
                "PaymentStatus":"Pending",
                "ErrorDetail": "",
                "Details": req_data
            
        }
        pay_status = pay.save_payment(client_id,session.id,data)
        

        return build_response(session)
    
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)