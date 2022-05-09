from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'appointment/'

def get_bookable_item_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve BookableItems for Parameters {%s}', params)

    end_point = base_path + 'bookableitems'
    resp = do_get(end_point, params,True)
    return resp