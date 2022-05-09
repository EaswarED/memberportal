from shared.utilities.Util import Util
from shared.utilities.logger import get_logger
from shared.helpers.api_helper import build_custom_err_response
from shared.exceptions.exception import APIValidationError
from providers.dynamodb.modules import appt, group, client, company, self_care, db_class, form
from providers.vimeo.modules import category
from providers.jotform.modules import forms
from shared.utilities import constant

logger = get_logger(__name__)
stage = 'dev-'


def list_group(event, context):
    try:
        result = group.list_group()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_group(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        class_id = 9
        result = group.get_group(class_id)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_group(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        class_id = '19365'
        is_fixed = True
        #sis_fixed = False
        if (is_fixed == True):
            start_dt = '2021-01-01'
            end_dt = '2021-12-30'
        else:
            start_dt = None
            end_dt = None

        total_sessions = 100
        total_seats = 200
        form_id = [213411666368054, 213408640435047]
        is_publish = False
        is_global = True
        category_id = 1006
        mark_class = False
        name = 'Yoga'
        open_ended = False
        clinical_form = [4244887, 4244888]

        # Build (Partial) Object and call Save
        group_details = {
            'IsFixed': is_fixed,
            'OpenEnded': open_ended,
            'StartDt': start_dt,
            'EndDt': end_dt,
            'TotalSessions': total_sessions,
            'SeatCnt': total_seats,
            'CreatedDt': Util.get_timestamp(),
            'Publish': is_publish,
            'GlobalAccess': is_global,
            'CategoryId': category_id,
            'ClassId': class_id,
            'Forms': form_id[0],
            'Mark_Class': mark_class,
            'Name': name,
            'Clinical_Form': clinical_form[0]
        }
        item = {
            'Details': group_details
        }
        result = group.save_group(class_id, item)
    except APIValidationError as e:
        return build_custom_err_response({}, e)

# Class dynamodb


def class_list(event, context):
    try:
        result = db_class.class_list()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_class(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        class_id = '19990'
        form_id = [213411666368054, 213408640435047]
        is_publish = True
        is_global = True
        name = 'Sweat'
        mark_group = False
        category_id = 1003

        # Build (Partial) Object and call Save
        class_details = {
            'Publish': is_publish,
            'GlobalAccess': is_global,
            'CategoryId': category_id,
            'ClassId': class_id,
            'Forms': form_id[0],
            'Name': name,
            'Mark_Group': mark_group

        }
        item = {
            'Details': class_details
        }
        result = db_class.save_class(class_id, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_class(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        class_id = 19990
        result = db_class.get_class(class_id)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_client(event, context):
    try:
        client_id = 100000011
        result = client.get_client(client_id)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_client(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        client_id = 100015630
        company_cd = 'C001'

        # Build (Partial) Object and call Save
        details = {
            'RegisteredDt': Util.get_timestamp(),
            'CompanyCd': company_cd,
            'StatusIn': constant.REQUEST_PENDING
        }
        item = {
            'Details': details
        }
        result = client.save_client(client_id, item)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def list_client_group(event, context):
    try:
        client_id = 100015628
        result = client.list_group(client_id)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def request_join(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from 'Request to Join' Action
        client_id = 100000011
        group_id = 25406

        # Build (Partial) Object and call Save
        details = {
            'RequestDt': Util.get_timestamp(),
            'StatusIn': constant.REQUEST_PENDING
        }
        result = client.request_join(client_id, group_id, details)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def process_request(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from 'Request to Join' Action
        client_id = 100000011
        group_id = 68
        request_type = constant.REQUEST_APPROVED   # Retrieve from Request Object
        # request_type = constant.REQUEST_DENIED
        # request_type = constant.REQUEST_WITHDRAWN
        result = client.process_request(client_id, group_id, request_type)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def log_client_phq9(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from 'Request to Join' Action
        client_id = 100000011
        result = client.log_client_phq9(client_id)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def list_company(event, context):
    try:
        result = company.list_company()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_company(event, context):
    try:
        company_cd = 'C001'
        result = company.get_company(company_cd)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_company(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from 'Request to Join' Action
        company_cd = 'C001'
        name = 'Company 1'
        address_1 = '123 No Ave'
        address_2 = ''
        city = 'New City'
        state_cd = 'ST'
        zip = '12345'

        # Build (Partial) Object and call Save
        details = {
            'Name': name,
            'Address1': address_1,
            'Address2': address_2,
            'City': city,
            'StateCd': state_cd,
            'Zip': zip
        }

        item = {
            'Details': details
        }
        result = company.save_company(company_cd, item)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def list_category(event, context):
    try:
        result = self_care.list_category()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_category(event, context):
    try:
        category_name = 'Category 1'
        result = self_care.get_category(category_name)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_category(event, context):
    try:
        # Retrieve the values from category list
        category_id = '1002'
        category_name = 'Group Personal training'
        type = 'A'
        description = 'Session will blast your muscles and get you ready for that bathing suit!'

        # Build (Partial) Object and call Save
        details = {
            'Id': category_id,
            'Name': category_name,
            'Type': type,
            'Description': description

        }
        item = {
            'Details': details
        }
        result = self_care.save_category(category_id, item)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def test_vimeo(event, context):
    try:
        result = category.get_category_list('None')
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def test_jotform(event, context):
    try:
        result = forms.get_user_forms('None')
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)

# Vimeo category


def type_list(event, context):
    try:
        result = self_care.vimeo_type()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_vimeo_type(event, context):
    try:
        type_id = 200
        result = self_care.get_vimeo_type(type)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def save_vimeo_type(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        type_id = '200'
        type = 'P'
        name = 'PDF'

        type_details = {

            'Type': type,
            'Name': name
        }
        item = {
            'Details': type_details
        }
        result = self_care.save_vimeo_type(type_id, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)

# POST Vimeo Content Type


def save_content(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        code = 'C03'
        name = 'My Content'
        type = 'content'

        # Build (Partial) Object and call Save
        type_details = {

            'Code': code,
            'Name': name,
            'Type': type
        }
        item = {
            'Details': type_details
        }
        result = self_care.save_content(code, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
# list Vimeo Contnet Type


def content_types(event, context):
    try:
        result = self_care.content_type()
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)


def get_content_types(event, context):
    try:
        code = 'C01'
        result = self_care.get_content(code)
        logger.debug(result)

    except APIValidationError as e:
        return build_custom_err_response({}, e)

# DR.Chrono Clinical Form


def save_form(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        form_id = '4244887'
        name = "onpatient Additional Info"

        # Build (Partial) Object and call Save
        type_details = {

            'Id': form_id,
            'Name': name
        }
        item = {
            'Details': type_details
        }
        result = form.save_form(form_id, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
# Add appt in DB


def save_appt(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        session_id = '23'
        form_id = [213411666368054, 213408640435047]
        clinical_form = ['4244887', '4244888']
        is_publish = True
        is_global = True
        name = 'Nutrition Consultation'
        category_id = 1001

        # Build (Partial) Object and call Save
        appt_details = {
            'Publish': is_publish,
            'GlobalAccess': is_global,
            'CategoryId': category_id,
            'SessionId': session_id,
            'Forms': form_id[0],
            'Name': name,
            'ClinicalFormId': clinical_form[0]
        }
        item = {
            'Details': appt_details
        }
        result = appt.save_appts(session_id, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)

# Add instuctor to video


def self_instructor(event, context):
    try:
        # Retrieve the values from Request Object. This method will be called from the Admin Portal
        staff_id = ['100000015', '100000011']
        name = 'Q in LGBTQIA+'
        category_id = 1008
        is_publish = True
        is_global = False

        # Build (Partial) Object and call Save
        inst_details = {
            'Publish': is_publish,
            'GlobalAccess': is_global,
            'CategoryId': category_id,
            'Name': name,
            'StaffId': staff_id[1]
        }
        item = {
            'Details': inst_details
        }
        result = self_care.save_instructor(name, item)
        logger.debug(result)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
