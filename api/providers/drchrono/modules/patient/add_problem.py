from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_post

logger = get_logger(__name__)
base_path = ''

def add_problem_list(params):
    logger.debug(
        'DrChrono: Attempting to Retrieve Patient Allergies for Parameters {%s}', params)

    end_point = base_path + 'problems'
    resp = do_post(end_point, params)
    return resp


