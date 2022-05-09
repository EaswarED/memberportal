from shared.utilities.logger import get_logger
from providers.drchrono.helpers.drchrono_api_helper import do_post

logger = get_logger(__name__)
base_path = ''

def create_clinical(params):
    logger.debug(
        'DrChrono: Attempting to add  Patient clinical notes for Parameters {%s}', params)

    end_point = base_path + 'clinical_note_field_values'
    resp = do_post(end_point, params)
    return resp