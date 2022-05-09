from providers.mindbody.helpers.mindbody_api_helper import do_post
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'client/'

def reset(params):
    logger.debug(
        'Mindbody: Reset PAssword for client {%s}', params)

    end_point = base_path + 'sendpasswordresetemail'
    resp = do_post(end_point, params)
    return resp