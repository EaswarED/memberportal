from providers.mindbody.helpers.mindbody_api_helper import do_post
from shared.utilities.logger import get_logger

logger = get_logger(__name__)
base_path = 'client/'

def add_update_client_visit(params):
    logger.debug(
        'Mindbody: Updated client visit {%s}', params)

    end_point = base_path + 'updateclientvisit'
    resp = do_post(end_point, params)
    return resp