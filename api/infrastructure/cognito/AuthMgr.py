import boto3

from shared.utilities.logger import get_logger
from infrastructure.secret.SecretMgr import SecretMgr


class AuthMgr:

    authMgr = None
    logger = None
    cognito_client = None
    cognito_user_pool_id = None
    cognito_app_client_id = None

    @staticmethod
    def get_instance():
        if AuthMgr.authMgr is None:
            AuthMgr.authMgr = AuthMgr()
        return AuthMgr.authMgr

    def authenticate(self, username: str, password: str) -> None:
        self.logger.debug(
            'Performing Authentication => [{%s} / {%s}]', username, password)
        resp = self.cognito_client.admin_initiate_auth(
            UserPoolId=self.cognito_user_pool_id,
            ClientId=self.cognito_app_client_id,
            AuthFlow='ADMIN_NO_SRP_AUTH',
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password
            }
        )

        self.logger.debug(resp)
        self.logger.info("Authentication Successful")
        return resp

    def create_aws_account(self, username: str, password: str) -> None:
        self.logger.debug(
            'Attempting to Create AWS User Account => [{%s} / {%s}]', username, password)

        resp = self.cognito_client.sign_up(
            ClientId=self.cognito_app_client_id,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': username
                },
            ]
        )

        # then confirm signup
        resp = self.cognito_client.admin_confirm_sign_up(
            UserPoolId=self.cognito_user_pool_id,
            Username=username
        )
        self.logger.debug(resp)
        self.logger.info("User Account Created Successfully")
        return resp

    '''
    '' Private Functions
    '''

    def __init__(self):
        self._initialize()

    def _initialize(self):
        self.logger = get_logger(__name__)
        self.logger.debug('Attempting to create AuthMgr()')

        secretMgr = SecretMgr.get_instance()
        self.cognito_client = boto3.client('cognito-idp')
        self.cognito_user_pool_id = secretMgr.get_cognito_value(
            'COGNITO_USER_POOL_ID')
        self.cognito_app_client_id = secretMgr.get_cognito_value(
            'COGNITO_APP_CLIENT_ID')

        self.logger.debug('Initialized AuthMgr() => ' + str(self))
