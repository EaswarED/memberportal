from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'class/'

def get_class_visit(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve the cancel status for client for Parameters {%s}', params)

    end_point = base_path + 'classvisits'
    resp = do_get(end_point, params)
    return resp