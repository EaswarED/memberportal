from providers.mindbody.helpers.mindbody_api_helper import do_post
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'usertoken/'

def login_detail(params):
    logger.debug(
        'Mindbody: Login client {%s}', params)

    end_point = base_path + 'issue'
    resp = do_post(end_point, params)
    return resp