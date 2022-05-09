import requests
from shared.exceptions.exception import APIResponseException
from infrastructure.secret.SecretMgr import SecretMgr
from shared.helpers.api_helper import invoke_get, invoke_post, get_response, get_status_obj
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger


_api_key = None

_api_url = None
_site_id = None
_auth_header = None
_token = None
logger = get_logger(__name__)


def get_user_token():
    # TODO - Check for expiry and Generate a new Token - If necessary
    # return 'e571ef55ab7c4533b6628f0007645830a70a5d2187b0447bbf6ff6e4b116bcab'
    return _token


def do_get(end_point, params={},skip_bearer=False):
    _build_header(skip_bearer)
    resp = invoke_get(_api_url + end_point, _auth_header, params)
    logger.debug(
        'Getting response from looking for data {%s}', resp.content)

    if resp.status_code == 400:
        data = resp.json()
        error = Util.get_dict_data(data['Error'], 'Message')
        raise APIResponseException(error)
    elif not resp.status_code == 200:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
   
    data = resp.json()
    resp.close()

    return data


def do_post(end_point, params={},skip_bearer=False):
    _build_header(skip_bearer)
    resp = invoke_post(_api_url + end_point, _auth_header, params)
    logger.debug(
        'Getting response from creating data {%s}', resp.content)

    if resp.status_code == 400 or resp.status_code == 'Unknown' or resp.status_code == 409:
        data = resp.json()
        error = Util.get_dict_data(data['Error'], 'Message')
        return data
        # raise APIResponseException(error)
    elif not resp.status_code == 200:
        logger.debug('!!!!! Error !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())
    
    data = resp.json()
    resp.close()

    return data


'''
'' Private Functions
'''


def _build_header(skip_bearer=False):
    global _api_url, _api_key, _site_id, _auth_header, _token
    if _api_url is None or _site_id is None or _token is None:
        secretMgr = SecretMgr.get_instance()
        _api_url = secretMgr.get_mindbody_value('MINDBODY_API_URL')
        _api_key = secretMgr.get_mindbody_value('MINDBODY_API_KEY')
        _site_id = secretMgr.get_mindbody_value('MINDBODY_SITE_ID')
        login = secretMgr.get_mindbody_value('MINDBODY_LOGIN')
        passwd = secretMgr.get_mindbody_value('MINDBODY_PASSWORD')
        _token = _refresh_roken(login, passwd)
    if skip_bearer !=True:
        _auth_header = {
            'Api-Key': _api_key,
            'SiteId': _site_id,
            'Authorization': 'Bearer ' + get_user_token(),
            "content-type": "application/json",
        }
    else:
         _auth_header = {
            'Api-Key': _api_key,
            'SiteId': _site_id,
            "content-type": "application/json",
        }

    print('_auth_header',_auth_header)


def _refresh_roken(login, passwd):
    global _api_url, _api_key, _site_id
    auth_header = {
        'Content-Type': 'application/json',
        'Api-Key': _api_key,
        'SiteId': _site_id
    }

    params = {
        "Username": login,
        "Password": passwd
    }

    resp = requests.post(_api_url + 'usertoken/issue',
                         json=params, headers=auth_header)

    if not resp.status_code == 200:
        logger.debug('!!!!! Error Getting New Token !!!!!')
        logger.debug('TODO')
        raise APIResponseException(resp.raise_for_status())

    result = resp.json()
    return result['AccessToken']
