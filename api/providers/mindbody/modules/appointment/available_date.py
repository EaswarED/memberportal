from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'appointment/'

def get_available_dates_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve Available Date for Parameters {%s}', params)

    end_point = base_path + 'availabledates'
    resp = do_get(end_point, params)
    return resp
