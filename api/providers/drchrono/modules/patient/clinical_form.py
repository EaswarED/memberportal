from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_get

logger = get_logger(__name__)
base_path = ''

def get_clinical(params):
    logger.debug(
        'DrChrono: Attempting to add  Patient clinical notes for Parameters {%s}', params)

    end_point = base_path + 'clinical_note_field_types'
    resp = do_get(end_point, params)
    return resp