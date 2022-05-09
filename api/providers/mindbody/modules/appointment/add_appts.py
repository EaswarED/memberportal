from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'appointment/'

def create_appointment(params):
    logger.debug(
        'Mindbody: Attempting to create Appointments for the client {%s}', params)

    end_point = base_path + 'addappointment'
    resp = do_post(end_point, params)
    return resp