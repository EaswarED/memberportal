from shared.utilities.logger import get_logger
from providers.vimeo.helpers.vimeo_api_helper import do_get

logger = get_logger(__name__)
base_path = 'videos/'

def get_specific_list(params):
    logger.debug(
        'Vimeo: Attempting to Retrieve Specific Videos for Parameters {%s}', params)
    video_id = params['video_id']
    end_point = base_path + '{}'.format(video_id)  
    resp = do_get(end_point, params)
    return resp