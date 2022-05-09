import pandas as pd
import json
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_response, build_security_response
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.dynamodb.modules import category
from shared.exceptions.exception import APIValidationError, SecurityException
import json

logger = get_logger(__name__)

# Get the list of Category


def category_list(type):
    
        result = category.list_category()
        dynodb_df = pd.json_normalize(result)
        

        if type:
            dynodb_df = Util.filter_df_by_column(
                dynodb_df, 'Details.Type', Util.to_upper(type))

        return build_response(Util.to_dict(dynodb_df))

    