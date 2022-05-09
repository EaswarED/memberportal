from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from shared.utilities.logger import get_logger
from infrastructure.secret.SecretMgr import SecretMgr

_api_key = None
_from_address = None

logger = get_logger(__name__)

'''
'' Private Functions
'''


def send_email(to_address, subject, body):
    _initialize()
    message = Mail(
        from_email=_from_address,
        to_emails=to_address,
        subject=subject,
        html_content=body)

    try:
        sg = SendGridAPIClient(_api_key)
        response = sg.send(message)
        logger.debug(response.status_code)
        return response.status_code
    except Exception as e:
        # TODO: Handle Properly
        print("Error: {0}".format(e))


def send_template_email(to_address, template_id, message_data):
    _initialize()

    message = Mail(
        from_email=_from_address,
        to_emails=to_address)

    message.dynamic_template_data = message_data
    message.template_id = template_id

    try:
        sg = SendGridAPIClient(_api_key)
        response = sg.send(message)
        logger.debug(response.status_code)
        return response.status_code
    except Exception as e:
        # TODO: Handle Properly
        print("Error: {0}".format(e))

def _initialize():
   global _api_key, _from_address
   
   if _api_key is None or _from_address is None:
       secretMgr = SecretMgr.get_instance()
       _api_key = secretMgr.get_twilio_value('TWILIO_API_KEY')
       _from_address = secretMgr.get_twilio_value('TWILIO_FROM_ADDRESS')
