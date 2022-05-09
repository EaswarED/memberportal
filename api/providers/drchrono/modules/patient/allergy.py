from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_get

logger = get_logger(__name__)
base_path = ''

def get_allergy_list(params):
    logger.debug(
        'DrChrono: Attempting to Retrieve Patient Allergies for Parameters {%s}', params)

    end_point = base_path + 'allergies'
    resp = do_get(end_point, params)
    return resp
