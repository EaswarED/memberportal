import pandas as pd
import json
from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from shared.helpers.api_helper import build_custom_err_response, build_err_response, build_response, build_security_response
from shared.exceptions.exception import APIValidationError, SecurityException
from providers.drchrono.modules.patient import clinical_form, clinical_note



logger = get_logger(__name__)


def get_clinical_template(event, context):
    try:
        template_id = Util.get_path_param(event, 'id')
        params = {'clinical_note_template': template_id}
        resp = clinical_form.get_clinical(params)
        data = Util.get_dict_data(resp, 'results')
        template_df = pd.json_normalize(data)
        columns = ['id', 'name', 'data_type', 'required',
                   'clinical_note_template', 'allowed_values']
        template_df = Util.get_df_by_column(template_df, columns)

        return build_response(Util.to_dict(template_df))
        
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response([], e)


def submit_form(event, context):
    try:

        # req_data = json.loads(event['body'])
        # logger.debug('Request Body: %s', req_data)

        formData = [
            {'clinical_note_field': 113818058, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 113818059, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579334, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579335, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579336, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579337, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579338, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579339, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579340, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579342, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579343, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579344, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579345, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579346, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579347, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579348, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': '0 - Not at all'},
            {'clinical_note_field': 115579349, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'test comme'},
            {'clinical_note_field': 115579351, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579352, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579353, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579354, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579355, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579356, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579357, 'appointment': 199983115,
                'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'},
            {'clinical_note_field': 115579358, 'appointment': 199983115, 'clinical_note_template': 4244887, 'doctor': 292542, 'value': 'Good'}]

        # formData = json.dumps(formData)
        resp_data = clinical_note.create_clinical(json.dumps(formData))

        logger.debug('Request created: {%s}', resp_data)
        return build_response(resp_data)

    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)
