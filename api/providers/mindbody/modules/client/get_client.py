from providers.mindbody.helpers.mindbody_api_helper import do_get
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'client/'

def get_view_client(params):
    logger.debug(
        'Mindbody: View client {%s}', params)

    end_point = base_path + 'clients'
    resp = do_get(end_point, params)
    return resp