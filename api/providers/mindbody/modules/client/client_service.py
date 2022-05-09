from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'client/'

def get_client_service(params):
    logger.debug(
        'Mindbody:Retrieve all clientservices {%s}', params)

    end_point = base_path + 'clientservices'
    resp = do_get(end_point, params)
    return resp