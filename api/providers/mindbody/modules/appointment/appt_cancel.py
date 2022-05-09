from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'appointment/'


def update_appointment(params):
    logger.debug(
        'Mindbody: Attempting to create Appointments for the client {%s}', params)

    end_point = base_path + 'updateappointment'
    print(params)
    resp = do_post(end_point, params)
    return resp
