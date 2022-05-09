import json
import os
import boto3
import base64

from shared.utilities.logger import get_logger
from shared.helpers.env_helper import get_env_value
from shared.utilities.Util import Util


class SecretMgr:

    logger = None
    _secretMgr = None
    _cognito_secret_obj = None
    _mindbody_secret_obj = None
    _drchrono_secret_obj = None
    _vimeo_secret_obj = None
    _jotform_secret_obj = None
    _twilio_secret_obj = None

    @staticmethod
    def get_instance():
        if SecretMgr._secretMgr is None:
            SecretMgr._secretMgr = SecretMgr()
        return SecretMgr._secretMgr

    def get_cognito_value(self, key):
        return Util.get_dict_data(self._cognito_secret_obj, key)

    def get_mindbody_value(self, key):
        return Util.get_dict_data(self._mindbody_secret_obj, key)
    def get_drchrono_value(self, key):
        return Util.get_dict_data(self._drchrono_secret_obj, key)

    def get_vimeo_value(self, key):
        return Util.get_dict_data(self._vimeo_secret_obj, key)

    def get_jotform_value(self, key):
        return Util.get_dict_data(self._jotform_secret_obj, key)

    def get_twilio_value(self, key):
        return Util.get_dict_data(self._twilio_secret_obj, key)


    '''
    '' Private Functions
    '''

    def __init__(self):
        self._initialize()

    def _initialize(self):
        self.logger = get_logger(__name__)
        self.logger.debug('Attempting to create SecretMgr()')

        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=os.environ['AWS_REGION']
        )

        self._cognito_secret_obj = self._get_secret(client,
                                                    get_env_value('COGNITO_SECRET'))
        self._mindbody_secret_obj = self._get_secret(client,
                                                     get_env_value('MINDBODY_SECRET'))
        self._drchrono_secret_obj = self._get_secret(client,
                                                     get_env_value('DRCHRONO_SECRET'))
        self._vimeo_secret_obj = self._get_secret(client,
                                                  get_env_value('VIMEO_SECRET'))
        self._jotform_secret_obj = self._get_secret(client,
                                                    get_env_value('JOTFORM_SECRET'))
        self._twilio_secret_obj = self._get_secret(client,
                                                    get_env_value('TWILIO_SECRET'))

        self.logger.debug('Initialized SecretMgr() => ' + str(self))

    def _get_secret(self, client, secret_name):
        self.logger.debug('Retrieving Secret for {%s}', secret_name)

        try:
            get_secret_value_response = client.get_secret_value(
                SecretId=secret_name
            )
        except Exception as e:
            self.logger.exception(
                'Exception occured while retrieving secret {%s}', str(e))
            raise e
        else:
            self.logger.debug(
                'Succcessfully retrieved Secret for {%s}', secret_name)
            if 'SecretString' in get_secret_value_response:
                return json.loads(get_secret_value_response['SecretString'])
            else:
                return base64.b64decode(
                    get_secret_value_response['SecretBinary'])
