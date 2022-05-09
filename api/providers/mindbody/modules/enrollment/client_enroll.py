from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'enrollment/'

def add_enroll(params):
    logger.debug(
        'Mindbody: Attempting to add Client  for the Enrollments Classes for Parameters {%s}', params)

    end_point = base_path + 'AddClientToEnrollment'
    resp = do_post(end_point, params)
    return resp