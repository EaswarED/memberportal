from shared.exceptions.exception import APIResponseException
from infrastructure.secret.SecretMgr import SecretMgr
from shared.helpers.api_helper import invoke_get, invoke_post,get_response, get_status_obj
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger


_api_url = None
_api_key = None
_auth_header = None
logger = get_logger(__name__)


def do_get(end_point, params={}):
    _build_header()
    resp = invoke_get(_api_url + end_point + _api_key, _auth_header, params)

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
    resp = invoke_post(_api_url+end_point+_api_key+'&'+params, _auth_header, {})
    print(resp.text)
    logger.debug(
        'Getting response from creating data {%s}', resp.content)
    if not resp.status_code == 200:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    return resp.json()

def _build_header():
    global _auth_header, _api_url, _api_key
    if _api_key is None or _api_url is None:

        secretMgr = SecretMgr.get_instance()

        _api_url = secretMgr.get_jotform_value('JOTFORM_API_URL')
        api_key = secretMgr.get_jotform_value('JOTFORM_API_KEY')

        _api_key = '?apikey=' + api_key
        _auth_header = {
            "content-type": "application/json",
        }
