from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_post

logger = get_logger(__name__)
base_path = ''

def add_medication_details(params):
    logger.debug(
        'DrChrono: Attempting to Add Patient Medications for Parameters {%s}', params)

    end_point = base_path + 'medications'
    resp = do_post(end_point, params)
    return resp