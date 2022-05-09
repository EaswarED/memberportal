from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'class/'

def del_client_class(params):
    logger.debug(
        'Mindbody: Attempting to Remove Client from  Class for Parameters {%s}', params)

    end_point = base_path + 'removeclientfromclass'
    resp = do_post(end_point, params)
    return resp