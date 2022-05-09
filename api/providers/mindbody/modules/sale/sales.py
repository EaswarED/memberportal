from providers.mindbody.helpers.mindbody_api_helper import do_get
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'sale/'

def get_sale_details(params):
    logger.debug(
        'Mindbody: Get Contracts {%s}', params)

    end_point = base_path + 'sales'
    resp = do_get(end_point, params)
    return resp