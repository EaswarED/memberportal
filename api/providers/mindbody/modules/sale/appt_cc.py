from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_post

logger = get_logger(__name__)
base_path = 'sale/'

def buy_appointment_cc(params):
    logger.debug(
        'Mindbody: Buy and Book Appointments for Parameters {%s}', params)

    end_point = base_path + 'checkoutshoppingcart'
    resp = do_post(end_point, params)
    return resp