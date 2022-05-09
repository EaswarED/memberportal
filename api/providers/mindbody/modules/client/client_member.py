from providers.mindbody.helpers.mindbody_api_helper import do_get
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'client/'

def view_client_membership(params):
    logger.debug(
        'Mindbody: Added client {%s}', params)

    end_point = base_path + 'activeclientmemberships'
    resp = do_get(end_point, params)
    return resp