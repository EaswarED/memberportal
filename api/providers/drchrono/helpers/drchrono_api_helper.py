from shared.exceptions.exception import APIResponseException
from infrastructure.secret.SecretMgr import SecretMgr
from shared.helpers.api_helper import invoke_get, invoke_post,get_response, get_status_obj
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger


_access_token = None
_api_url = None
logger = get_logger(__name__)


def do_get(end_point, params={}):
    auth_header = _get_header()
    print('rrr',auth_header)
    resp = invoke_get(_api_url + end_point, auth_header, params)
    # print('rrr',resp)
    logger.debug(
        'Getting response {%s}', resp.content)

    if not resp.status_code == 200:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    return resp.json()


def do_post(end_point, params={}):
    auth_header = _get_header()
    resp = invoke_post(_api_url + end_point, auth_header, params)
    logger.debug(
        'Getting response from creating data {%s}', resp.content)
    if not resp.status_code == 201:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    return resp.json()

'''
'' Private Functions
'''

def _get_header():
    global _api_url
    if _api_url is None:
        secretMgr = SecretMgr.get_instance()
        _api_url = secretMgr.get_drchrono_value('DRCHRONO_API_URL')

    auth_header = {
        'Authorization': "Bearer " + _get_access_token(),
        "content-type": "application/json",
    }
    return auth_header


def _get_access_token():
    global _access_token
    logger.debug('Attempting to generate a new DRChrono Access Token')
    header = {
        "content-type": "application/x-www-form-urlencoded",
    }
    secretMgr = SecretMgr.get_instance()
    auth_url = secretMgr.get_drchrono_value('DRCHRONO_AUTH_URL')
    refresh_token = secretMgr.get_drchrono_value('DRCHRONO_REFRESH_TOKEN')
    client_id = secretMgr.get_drchrono_value('DRCHRONO_CLIENT_ID')
    client_secret = secretMgr.get_drchrono_value('DRCHRONO_CLIENT_SECRET')

    response = invoke_post(auth_url, header, {
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token',
        'client_id': client_id,
        'client_secret': client_secret,
    })
    data = response.json()
    print('data',data)
    _access_token = data['access_token']
    if not _access_token is None:
        return _access_token
    return _access_token
