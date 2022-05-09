import os
import logging
import logging.handlers as handlers

from shared.helpers.env_helper import get_env_value
from shared.utilities.Util import Util


def get_logger(name):
    logger = logging.getLogger(name)
    logger.propagate = False
    logger.setLevel(_get_level('LOGGING_LEVEL'))

    formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(message)s')

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    #log_file = os.environ['LOG_FILE_NAME']
    log_file = Util.get_dict_data(os.environ, 'LOG_FILE_NAME')
    #log_file = Util.get_data()
    if log_file:
        file_handler = handlers.TimedRotatingFileHandler(
            log_file, when='M', interval=1)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(_get_level('LOG_FILE_LEVEL'))
        logger.addHandler(file_handler)

    logger.info('Initialized Logger() for => ' + name)
    return logger


def handle_exception(self, e):
    logging.exception(e)


'''
'' Private Functions
'''


def _get_level(str):
    level = get_env_value(str)
    if level:
        return int(level)
    else:
        return 10  # Default Level
