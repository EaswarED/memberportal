from numpy import True_
from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'class/'

def create_client_class(params):
    logger.debug(
        'Mindbody: Attempting to add Classes for Parameters {%s}', params)

    end_point = base_path + 'addclienttoclass'
    resp = do_post(end_point, params,True)
    return resp