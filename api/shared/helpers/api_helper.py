import requests
import json

from requests import sessions
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger

logger = get_logger(__name__)


def invoke_get(api_url, req_headers, req_params):
    with sessions.Session() as session:
        return session.request('get', api_url, params=req_params, headers=req_headers)
        return requests.get(api_url, params=req_params, headers=req_headers)
    # return response


def invoke_post(api_url, req_headers, req_params):
    response = requests.post(api_url, data=req_params, headers=req_headers)
    return response


def build_empty_response():
    return build_response([])


def build_response(data, status_code=200):
    return _build_response(data, status_code)


def build_msg_response(data, msg=None, status_code=200):
    return _build_response(data, status_code, msg)


def build_warn_response(data, msg=None, status_code=200):
    return _build_response(data, status_code, None, None, msg)


def build_err_response(data, e: Exception):
    err = 'Unexpected Technical Error Occured'
    status_code = 499
    if e:
        logger.exception(e)
        err = Util.to_str(e)
        status_code = 200

    return _build_response(data, status_code, None, err)


def build_custom_err_response(data, e: Exception, str=None):
    err = str
    if e:
        logger.exception(e)
        err = Util.to_str(e)

    return _build_response(data, 200, None, err)


def build_security_response(data, e: Exception, str=None):
    err = str
    if e:
        logger.exception(e)
        err = Util.to_str(e)

    return _get_response_404()

def build_mindbody_response(data, e: Exception, str=None):
    err = str
    if e:
        logger.exception(e)
        err = Util.to_str(e)

    return _get_response_500()

def get_response(status_obj, data, status_code=200):
    response_obj = {
        'status': status_obj,
        'data': data
    }

    valid_status_codes = [200, 201, 400, 401, 403, 404, 500]
    if (status_code not in valid_status_codes):
        status_code = 499   # Unassigned Response Code

    # Return 200, 201, 400, 403, 404, 500
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(response_obj),
    }

def get_status_obj(data, msg, err=None, warn=None):
    code = 1
    if err:
        code = 2
    elif warn:
        code = 3
        msg = warn

    if (type(data) == list):
        record_cnt = len(data)
    elif data:
        record_cnt = min(len(data), 1)
    else:
        record_cnt = 0

    status_obj = {
        'code': code,    # Custom Error Code (if needed)
        'err': err,
        'msg': msg,
        'totalRecords': record_cnt
    }
    return status_obj


'''
'' Private Functions
'''


def _get_response_404():
    return {
        'statusCode': 404,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
            'body': json.dumps({'ErrorMessage': 'Access Denied'}),
        }
    }

def _get_response_500():
    return {
        'statusCode': 500,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
            'body': json.dumps({'ErrorMessage': 'Error Accessing Mindbody'}),
        }
    }

def _build_response(data, status_code, msg=None, err=None, warn=None):
    status_obj = get_status_obj(data, msg, err, warn)
    return get_response(status_obj, data, status_code)
