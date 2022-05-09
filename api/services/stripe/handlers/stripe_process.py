# import datetime
import datetime
import json
import stripe
import pandas as pd
from datetime import datetime as date
import time
from shared.utilities import constant
from providers.sendgrid.helpers.email_helper import send_template_email
from shared.exceptions.exception import APIValidationError, SecurityException
from shared.helpers.api_helper import build_custom_err_response,  build_err_response, build_response, build_security_response
from providers.mindbody.modules.sale  import appt_cc
from providers.mindbody.modules.staff  import staff
from shared.helpers import session_helper
from providers.dynamodb.modules import pay
from shared.utilities.Util import Util



def stripe_process(event, context):
    try:
        print(event)

        first_name = session_helper.get_client_first_name(event)
        email = session_helper.get_client_email(event)
        # client_id = '100000004'
        req_data = json.loads(event['body'])

        # session_id = 'cs_test_a1Zl7uCDJGHR03zDsOC6iUpC03oGRZ8wmX7mRmeIrQAbiWu0J1Tr3q4iro'
        session_id = req_data['sessionId']
        client_id = Util.to_str(req_data['clientId'])
        EpochTime = Util.get_current_epoch()

        print('llk', session_id, client_id)
        df = pay.get_payment(client_id, session_id)
        print('ll', df)
        item_details = df['Details']

        data = {
            "PaymentStatus": "Paid",
            "ErrorDetail": ""
        }
        pay_status = pay.update_payment(client_id, session_id, data, EpochTime)
        # 'Book'
        staff_id = staff.get_staff_df({"staffIds":item_details['StaffId']})
        if item_details['StaffId']:
            item = {
                "ClientId": client_id,
                "Test": False,
                "Items": [
                    {
                        "Item": {
                            "Type": constant.SERVICE_TYPE,
                            "Metadata": {
                                "Id": item_details['ServiceId'],
                            }
                        },
                        "Quantity": constant.QUANTITY_VALUE,
                        "AppointmentBookingRequests":[
                            {
                                "StaffId": item_details['StaffId'],
                                "LocationId":item_details['LocationId'],
                                "SessionTypeId": item_details['BookingId'],
                                "StartDateTime": item_details['StartDateTime'],

                            }]
                    }
                ],
                "Payments": [
                    {
                        "Type": constant.PAYMENT_TYPE,
                        "Metadata": {
                            "Amount": item_details['Amount'],
                            "Id": constant.PAYMENT_ID,
                        }
                    }
                ],
                "LocationId": item_details['LocationId']
            }
            resp_data = appt_cc.buy_appointment_cc(json.dumps(item))
            appt_data= Util.get_dict_data(resp_data,'Appointments')
            print(appt_data)

            if 'Error' in resp_data:
                data = {
                    "PaymentStatus": "Error",
                    "ErrorDetail": resp_data['Error']
                }
            else:
                data = {
                    "PaymentStatus": "Processed",
                    "ErrorDetail": ""
                }

            df = pd.json_normalize(appt_data)
            created_date= df['StartDateTime'].loc[0]
            converted_date = datetime.datetime.strptime(created_date, '%Y-%m-%dT%H:%M:%S')
            get_date = converted_date.strftime("%Y-%m-%d")
            get_time = converted_date.strftime("%H:%M %p")
            get_day = converted_date.strftime("%A")
            message_data = {
                "firstName": first_name,
                "day": get_day,
                "time": get_time,
                "date": get_date,
                "staff": staff_id['StaffName'].loc[0]
            }

            send_template_email(email,
                            constant.EMAIL_TEMPLATE_CREATE_APPT, message_data)
        else:
            item = {
                "ClientId": client_id,
                "Test": False,
                "Items": [
                    {
                        "Item": {
                            "Type": constant.SERVICE_TYPE,
                            "Metadata": {
                                "Id": item_details['ServiceId'],
                            }
                        },
                        "Quantity":constant.QUANTITY_VALUE,
                        "ClassIds":[item_details['BookingId']]

                    }
                ],
                "Payments": [
                    {
                        "Type": constant.PAYMENT_TYPE,
                        "Metadata": {
                            "Amount": item_details['Amount'],
                            "Id":constant.PAYMENT_ID,
                        }
                    }
                ],
                "LocationId": item_details['LocationId']
            }
            print(item)
            resp_data = appt_cc.buy_appointment_cc(json.dumps(item))
            class_data= Util.get_dict_data(resp_data,'Classes')
            print(class_data)

            if 'Error' in resp_data:
                data = {
                    "PaymentStatus": "Error",
                    "ErrorDetail": resp_data['Error']
                }
            else:
                data = {
                    "PaymentStatus": "Processed",
                    "ErrorDetail": ""
                }

            df = pd.json_normalize(class_data)
            df['StaffName'] = df['Staff.FirstName'] + ' ' + df ['Staff.LastName']
            created_date= df['StartDateTime'].loc[0]
            converted_date = datetime.datetime.strptime(created_date, '%Y-%m-%dT%H:%M:%S')
            get_date = converted_date.strftime("%Y-%m-%d")
            get_time = converted_date.strftime("%H:%M %p")
            get_day = converted_date.strftime("%A")
            message_data = {
                "firstName": first_name,
                "day": get_day,
                "time": get_time,
                "date": get_date,
                "staff": df['StaffName'].loc[0]
            }
            send_template_email(email,
                            constant.EMAIL_TEMPLATE_CREATE_CLASS, message_data)

        pay_status = pay.update_payment(client_id, session_id, data, EpochTime)
       
        return build_response(resp_data)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)

