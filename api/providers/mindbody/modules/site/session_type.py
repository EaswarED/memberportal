import pandas as pd
from shared.utilities.Util import Util
from shared.utilities import constant
from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'site/'


def get_session_type_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve all sessiontypes for Parameters {%s}', params)

    end_point = base_path + 'sessiontypes'
    resp = do_get(end_point, params)

    return resp


def get_session_type_appt_df(params={}):
    df = get_session_type_df(params)
    return Util.filter_df_by_column(df, 'Type', constant.CLASS_LABEL_APPT)


def get_session_type_class_df(params={}):
    df = get_session_type_df(params)
    return Util.filter_df_by_column(df, 'Type', constant.CLASS_LABEL_CLASS)


def get_session_type_group_df(params={}):
    df = get_session_type_df(params)
    return Util.filter_df_by_column(df, 'Type', constant.CLASS_LABEL_GROUP)


def get_session_type_df(params={}):
    # Session Type
    resp_data = get_session_type_list(params)
    data = Util.get_dict_data(resp_data, 'SessionTypes')
    session_df = pd.DataFrame(data)
    session_df.rename(columns={'Id': 'SessionTypeId'}, inplace=True)
    session_df.rename(columns={'Name': 'SessionName'}, inplace=True)
    columns = ['SessionTypeId', 'SessionName', 'Type']
    session_df = Util.get_df_by_column(session_df, columns)
    return session_df
