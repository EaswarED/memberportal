from providers.sendgrid.helpers.email_helper import send_email, send_template_email
from shared.utilities import constant

_api_key = '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'

def test_email(event, context):
    send_email('test@gmail.com', 'Test Subject', 'Body!!!')


def test_dynamic_email(event, context):
    message_data = {
        'firstname': 'Dev Client'
    }
    send_template_email('eagleblackmoso@gmail.com',
               constant.EMAIL_TEMPLATE_USER_REGISTRATION, message_data)

def test_payment_email(event, context):
    message_data = {
        'firstname': 'Dev Client',
        'amount':10,
        'product':'Coach Appt',
        'site':57274,
        'expDate':'04/01/2022'
    }
    send_template_email('eagleblackmoso@gmail.com',
               constant.EMAIL_TEMPLATE_USER_REGISTRATION, message_data)
