from shared.exceptions.exception import APIResponseException
from infrastructure.secret.SecretMgr import SecretMgr
from shared.helpers.api_helper import invoke_get, invoke_post,get_response, get_status_obj
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger


_api_url = None
_auth_header = None
logger = get_logger(__name__)


def do_get(end_point, params={}):
    _build_header()
    resp = invoke_get(_api_url + end_point, _auth_header, params)

    logger.debug(
        'Getting response {%s}', resp.content)

    if not resp.status_code == 200:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    return resp.json()


'''
'' Private Functions
'''

def do_post(end_point, params={}):
    _build_header()
    resp = invoke_post(_api_url + end_point, _auth_header, params)
    logger.debug(
        'Getting response from creating data {%s}', resp.content)
    if not resp.status_code == 201:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    return resp.json()

def _build_header():
    global _auth_header, _api_url
    if _auth_header is None or _api_url is None:

        secretMgr = SecretMgr.get_instance()

        _api_url = secretMgr.get_vimeo_value('VIMEO_API_URL')
        api_token = secretMgr.get_vimeo_value('VIMEO_API_TOKEN')
        auth_key = 'Bearer ' + api_token

        _auth_header = {
            'Authorization': auth_key,
            "content-type": "application/json",
        }
