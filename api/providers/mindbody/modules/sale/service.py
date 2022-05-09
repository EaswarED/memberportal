from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'sale/'

def get_services_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve all services  for Parameters {%s}', params)

    end_point = base_path + 'services'
    resp = do_get(end_point, params)
    return resp