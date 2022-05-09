from shared.utilities.logger import get_logger
from providers.vimeo.helpers.vimeo_api_helper import do_get

logger = get_logger(__name__)
base_path = ''

def get_video_list(params):
    logger.debug(
        'Vimeo: Attempting to Retrieve Videos for Parameters {%s}', params)

    end_point = base_path  +'users/112969140/videos'
    print(end_point)
    resp = do_get(end_point, params)
    return resp