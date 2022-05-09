import pandas as pd
from shared.utilities.Util import Util
from shared.utilities import constant
from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'site/'


def get_program_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve Programs {%s}', params)

    end_point = base_path + 'programs'
    resp = do_get(end_point, params)
    return resp


def get_appt_program_df(params={}):
    return get_program_df(params, True)


def get_program_df(params={}, only_appt=False):
    resp_data = get_program_list(params)
    data = Util.get_dict_data(resp_data, 'Programs')
    program_df = pd.DataFrame(data)

    if only_appt:
        program_df = Util.filter_df_by_column(
            program_df, 'ScheduleType', constant.CLASS_LABEL_APPT)

    program_df.rename(columns={'Name': 'ProgramName'}, inplace=True)
    program_df.rename(columns={'Id': 'ProgramId'}, inplace=True)
    columns = ['ProgramId', 'ProgramName']
    program_df = Util.get_df_by_column(program_df, columns)
    return program_df
