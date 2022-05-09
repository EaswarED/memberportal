from providers.mindbody.helpers.mindbody_api_helper import do_post
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'client/'

def create_client(params):
    logger.debug(
        'Mindbody: Added client {%s}', params)

    end_point = base_path + 'addclient'
    resp = do_post(end_point, params)
    return resp