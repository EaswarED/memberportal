import pandas as pd
import json
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_response, _build_response, build_empty_response, build_security_response
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.modules import category
from providers.mindbody.modules.site import program
from shared.exceptions.exception import APIValidationError, SecurityException
import json

logger = get_logger(__name__)

# Get the list of Category


def list_category(event, context):
    try:
        type = Util.get_path_param(event, 'type')
        result = category.list_category()
        dynodb_df = pd.json_normalize(result)
        

        if type:
            dynodb_df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', Util.to_upper(type))
        return build_response(Util.to_dict(dynodb_df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


def get_category(event, context):
    try:
        id = Util.get_path_param(event, 'id')

        if not id:
            return build_empty_response()

        result = category.get_category(id)
        return build_response(result)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def save_category(event, context):
    try:
        req_data = json.loads(event['body'])

        logger.debug('Request Body: %s', req_data)
        details = {
            'Name': req_data['name'],
            'Description': req_data['description'],
            'ImageUrl': req_data['imageUrl'],
            'Type': req_data['type']
        }
        item = {
            'Details': details
        }
        result = category.save_category(req_data['id'], item)
        return _build_response(result, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


def delete_category(event, context):
    try:
        req_data = json.loads(event['body'])
        # TO DO
        return _build_response({}, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)