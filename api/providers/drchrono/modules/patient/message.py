from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_get

logger = get_logger(__name__)
base_path = ''

def get_message_list(params):
    logger.debug(
        'DrChrono: Attempting to Retrieve Patient Messages for Parameters {%s}', params)

    end_point = base_path + 'messages'
    resp = do_get(end_point, params)
    return resp