import os
from shared.utilities.Util import Util


def get_env_value(key):
    return Util.get_dict_data(os.environ, key)
