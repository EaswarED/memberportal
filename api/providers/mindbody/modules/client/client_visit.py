from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'client/'

def get_client_visit(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve all clientvisits {%s}', params)

    end_point = base_path + 'clientvisits'
    resp = do_get(end_point, params)
    return resp