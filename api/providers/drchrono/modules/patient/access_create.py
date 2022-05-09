from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_post

logger = get_logger(__name__)
base_path = 'patients/'

def on_patient_create(params):
    logger.debug(
        'DrChrono: Attempting to On Patient Access for Parameters {%s}', params)
    id = params['id']
    end_point = base_path + '{id}/onpatient_access'.format(id)

    resp = do_post(end_point, params)
    return resp