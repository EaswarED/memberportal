from shared.utilities.logger import get_logger
from providers.jotform.helpers.jotform_api_helper import do_get

logger = get_logger(__name__)
base_path = 'user/'

def get_user_forms(params):
    logger.debug(
        'Jotform: Attempting to Retrieve User Forms for Parameters {%s}', params)

    end_point = base_path + 'forms'
    resp = do_get(end_point, params)
    return resp
