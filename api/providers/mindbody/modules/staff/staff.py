import pandas as pd
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from providers.mindbody.helpers.mindbody_api_helper import do_get

logger = get_logger(__name__)
base_path = 'staff/'


def get_staff_list(params):
    logger.debug(
        'Mindbody: Attempting to Retrieve Staff details for Parameters {%s}', params)

    end_point = base_path + 'staff'
    resp = do_get(end_point, params)
    return resp


def get_staff_df(params={}):
    resp_data = get_staff_list(params)
    data = Util.get_dict_data(resp_data, 'StaffMembers')
    staff_df = pd.DataFrame(data)
    staff_df.rename(columns={'Id': 'StaffId'}, inplace=True)
    staff_df.rename(columns={'Name': 'StaffName'}, inplace=True)
    staff_df = Util.get_df_by_column(staff_df, ['StaffId', 'StaffName'])
    return staff_df

