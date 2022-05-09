import pandas as pd
import json
import numpy as np
import re
from shared.helpers import session_helper
from shared.helpers.api_helper import build_empty_response, build_response, build_err_response, _build_response, build_security_response
from shared.utilities.logger import get_logger
from shared.utilities.Util import Util
from providers.vimeo.modules import related,appearance,specific_video
from providers.dynamodb.modules import self_care, category
from shared.utilities.logger import get_logger
from shared.helpers.api_helper import build_custom_err_response
from shared.exceptions.exception import APIValidationError, SecurityException

logger = get_logger(__name__)

def list_category(event, context):
    try:      

        result = self_care.list_category()
        logger.debug(result)
        result = list(filter(lambda rec: (rec['Type'] == 'SC' ) , result))
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        result.rename(columns = {'type':'type'}, inplace = True)
        result.rename(columns = {'description':'description'}, inplace = True)
        result.rename(columns = {'name':'categoryName'}, inplace = True)
        result.rename(columns = {'sK':'id'}, inplace = True)
        columns = ['type','description','id','categoryName']
        result = Util.get_df_by_column(result, columns) 
        result = result.replace(np.nan,"")
        
        return build_response(Util.to_dict(result))  
    
    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


#GET type list from DB
def list_type(event, context):
    try:
        logger.debug( 'Retrieve types for the Params {%s}')
        result = self_care.type()
        logger.debug(result)
        
        df = pd.json_normalize(Util.to_lower_key(result))
        df.rename(columns = {'details.Type':'type'}, inplace = True)
        df.rename(columns = {'sK':'id'}, inplace = True)
        df.rename(columns = {'details.Name':'name'}, inplace = True)
        columns = ['type','name','id']              
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


#GET Dynamodb Content type 
def list_content_details(event, context):
    try:
        logger.debug( 'Retrieve Content Types {%s}')
        result = self_care.list_content()
        logger.debug(result)
        df = pd.json_normalize(Util.to_lower_key(result))
        df.rename(columns = {'sK':'id'}, inplace = True)
        df.rename(columns = {'details.Type':'type'}, inplace = True)
        df.rename(columns = {'details.Name':'name'}, inplace = True)
        columns = ['id','name','type']              
        df = Util.get_df_by_column(df, columns)

        return build_response(Util.to_dict(df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


#GET Dynamodb categories
def video_list(event, context):
    try:
        client_id = session_helper.get_client_id(event)
        company_id = session_helper.get_company_id(event)
        params={'per_page':10}
        logger.debug( 'Retrieve Videos user can view for the Params {%s}',params)
        resp_data = appearance.get_video_list(params)
        data = Util.get_dict_data(resp_data, 'data')
        df = pd.DataFrame(Util.to_lower_key(data))
        print(df)
        base_list=[]
        for rec in df['pictures']:
            base_list.append(rec['base_link'])
        df['base_link']= base_list
        df.rename(columns = {'type':'typec'}, inplace = True)
        columns = ['uri','name','type','link','duration','embed','base_link']              
        df = Util.get_df_by_column(df, columns)
        print(df['uri'])
       
        uriId_list=[]
        for rec in df['uri']:
            regex = r"([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-9][0-9][0-9][0-9])"
            url = re.findall(regex,rec)
            uri_id = [x for x in url]
            uriId_list.append(''.join(uri_id))
        df['id']=uriId_list

    
        #Db self_care
        result = self_care.list_content_details()
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        selfcare_rename = {'sK':'scid','details.CategoryId':'categoryId','details.IsPublished':'publish','details.Description':'descriptions',
        
        'details.Type':'type','details.Name':'contentName'}
        result.rename(columns = selfcare_rename, inplace = True)
        columns = ['scid','descriptions','categoryId','type','contentName','publish']
        result = Util.get_df_by_column(result, columns)
        print('db', result)
         #merge data
        merge_df = pd.merge(result, df,left_on=["scid"] ,right_on=['id'],how="outer")
        
        columns = ['scid','id','descriptions','uri','name','link','duration','categoryId','type','contentName','publish','description','typec','base_link','embed']
        merged_df = Util.get_df_by_column(merge_df, columns)
        print(merged_df)
        #Category List
        result = category.list_category()
        category_df = pd.json_normalize(result)
        columns = {'SK': 'categoryId', 'Details.Name': 'categoryName'}
        category_df.rename(columns=columns, inplace=True)
        category_df['categoryId'] = category_df['categoryId'].apply(str)

        # Merge w/Category
        merge_df['categoryId'] = merge_df['categoryId'].apply(str)
        print(merge_df)
        final_df = Util.get_df_by_column(merge_df, columns)
        final_df = pd.merge(merged_df, category_df, left_on=[
        "categoryId"], right_on=["categoryId"], how="left")
        columns = ['scid','id','descriptions','uri','name','link','duration','categoryId','categoryName','type','contentName','publish','typec','base_link','embed']
       
        final_df = Util.get_df_by_column(final_df, columns)
        final_df['publish'] = final_df['publish'].replace(np.nan,False)
        final_df =  final_df.replace(np.nan,"")

        #Db filter by Permission
        content_ids = self_care.get_recommendation_list(client_id, company_id)
        print('cc',content_ids)
        merge_df1 = Util.filter_df_by_list(
             final_df, 'scid', content_ids)
             
        return build_response(Util.to_dict(merge_df1))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


def get_content(event, context):
    try:

        # params={}
        content_id = Util.get_path_param(event, 'id')
        params={'video_id' : content_id}
        results = specific_video.get_specific_list(params)
        df = pd.json_normalize(Util.to_lower_key(results))
        df.rename(columns = {'embed.html':'embed_html'}, inplace = True)
        df.rename(columns = {'pictures.base_link':'base_link'}, inplace = True)
        columns = ['uri','name','description','type','link','duration','embed_html','base_link']              
        df = Util.get_df_by_column(df, columns)

        #Db self_care
        result = self_care.get_content_details(content_id)
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        result.rename(columns = {'sK':'id'}, inplace = True)
        result.rename(columns = {'details.CategoryId':'categoryId'}, inplace = True)
        result.rename(columns = {'details.IsPublished':'publish'}, inplace = True)
        result.rename(columns = {'details.Type':'typec'}, inplace = True)
        result.rename(columns = {'details.Name':'contentName'}, inplace = True)
        columns = ['id','categoryId','publish','typec','contentName']
        result = Util.get_df_by_column(result, columns)
         #merge data
        merge_df = pd.merge(df,result, left_on=["name"] ,right_on=['contentName'],how="left")
        columns = ['id','categoryId','publish','type','contentName','description','name','typec','base_link','link']
        merged_df = Util.get_df_by_column(merge_df, columns)
     
        merged_df['publish'] = merged_df['publish'].replace(np.nan,False)
        merged_df =  merged_df.replace(np.nan,"")
        return build_response(Util.to_dict(merged_df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
            

def save_content_detail(event, context):
    try:
        req_data = json.loads(event['body'])
        logger.debug('Request Body: %s', req_data)

        details = {
            'IsPublished': req_data['isPublished'],
            'Name': req_data['name'],
            'CategoryId': req_data['categoryId'],
            'Description': req_data['description'],
            'Type':req_data['type']
           
        }

        item = {
            'Details': details
        }

        result = self_care.save_content_details(req_data['id'], item)
        logger.debug(result)

        return _build_response(result, 200)

    except SecurityException as e:
        return build_security_response({}, e)
    except APIValidationError as e:
        return build_custom_err_response({}, e)
    except Exception as e:
        return build_err_response({}, e)


        
#Related Videos
def related_video_list(event, context):
    try:
        params =json.loads("{\"video_id\":662717165,\"Item\":{\"filter\":\"related\"}}")
        logger.debug( 'Retrieve specific Videos  can view for the Params {%s}',params)
        
        resp_data = related.get_related_list(params)
        data = Util.get_dict_data(resp_data, 'data')
        df = pd.json_normalize(Util.to_lower_key(data))
        df.rename(columns = {'embed.html':'embed_html'}, inplace = True)
        df.rename(columns = {'pictures.base_link':'base_link'}, inplace = True)
        columns = ['uri','name','description','type','link','duration','embed_html','base_link']              
        df = Util.get_df_by_column(df, columns)
        print(df)
        #Db self_care
        result = self_care.list_content_details()
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        result.rename(columns = {'sK':'id'}, inplace = True)
        result.rename(columns = {'details.CategoryId':'categoryId'}, inplace = True)
        result.rename(columns = {'details.IsPublished':'publish'}, inplace = True)
        result.rename(columns = {'details.Type':'typec'}, inplace = True)
        result.rename(columns = {'details.Name':'contentName'}, inplace = True)
        columns = ['id','categoryId','publish','typec','contentName']
        result = Util.get_df_by_column(result, columns)
         #merge data
        merge_df = pd.merge(df,result, left_on=["name"] ,right_on=['contentName'],how="outer")
        columns = ['id','categoryId','publish','type','contentName','description','name','typec','uri','link','duration','embed_html','base_link','name']
        merged_df = Util.get_df_by_column(merge_df, columns)
     
        merged_df['publish'] = merged_df['publish'].replace(np.nan,False)
        merged_df =  merged_df.replace(np.nan,"")
        return build_response(Util.to_dict(merged_df))
    
    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


#Sprcific Videos
def specific_video_list(event, context):
    
    try:
        params =json.loads(event['body'])
        logger.debug( 'Retrieve specific Videos  can view for the Params {%s}',params)
        
        resp_data = specific_video.get_specific_list(params)
        # data = Util.get_dict_data(resp_data)
        df = pd.json_normalize(Util.to_lower_key(resp_data))
        df.rename(columns = {'embed.html':'embed_html'}, inplace = True)
        df.rename(columns = {'pictures.base_link':'base_link'}, inplace = True)
        columns = ['uri','name','description','type','link','duration','embed_html','base_link']              
        df = Util.get_df_by_column(df, columns)

        #Db self_care
        result = self_care.list_content_details()
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        result.rename(columns = {'sK':'id'}, inplace = True)
        result.rename(columns = {'details.CategoryId':'categoryId'}, inplace = True)
        result.rename(columns = {'details.IsGlobalAccess':'global'}, inplace = True)
        result.rename(columns = {'details.IsPublish':'publish'}, inplace = True)
        result.rename(columns = {'details.Type':'typec'}, inplace = True)
        result.rename(columns = {'details.Name':'contentName'}, inplace = True)
        columns = ['id','categoryId','global','publish','typec','contentName']
        result = Util.get_df_by_column(result, columns)
         #merge data
        merge_df = pd.merge(df,result, left_on=["name"] ,right_on=['contentName'],how="left")
        columns = ['id','categoryId','global','publish','type','contentName','description','name','typec']
        merged_df = Util.get_df_by_column(merge_df, columns)
     
        merged_df['global'] = merged_df['global'].replace(np.nan,False)
        merged_df['publish'] = merged_df['publish'].replace(np.nan,False)
        merged_df =  merged_df.replace(np.nan,"")
        return build_response(Util.to_dict(merged_df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)


# SelfCare
def video_list_details(event, context):
    try:
        params={'per_page':10}
        logger.debug( 'Retrieve Videos user can view for the Params {%s}',params)
        resp_data = appearance.get_video_list(params)
        data = Util.get_dict_data(resp_data, 'data')
        df = pd.DataFrame(Util.to_lower_key(data))
        print(df)
        base_list=[]
        for rec in df['pictures']:
            base_list.append(rec['base_link'])
        df['base_link']= base_list
        columns = ['uri','name','type','link','duration','embed','base_link']              
        df = Util.get_df_by_column(df, columns)
        print(df['uri'])
       
        uriId_list=[]
        for rec in df['uri']:
            regex = r"([0-9]|[0-9][0-9]|[0-9][0-9][0-9]|[0-9][0-9][0-9][0-9])"
            url = re.findall(regex,rec)
            uri_id = [x for x in url]
            uriId_list.append(''.join(uri_id))
        df['id']=uriId_list
    
        #Db self_care
        result = self_care.list_content_details()
        result = pd.json_normalize(Util.to_lower_key(result))
        result = pd.DataFrame(result) 
        result.rename(columns = {'sK':'scid'}, inplace = True)
        result.rename(columns = {'details.CategoryId':'categoryId'}, inplace = True)
        
        result.rename(columns = {'details.IsPublished':'publish'}, inplace = True)
        result.rename(columns = {'details.Type':'typec'}, inplace = True)
        result.rename(columns = {'details.Name':'contentName'}, inplace = True)
        columns = ['id','categoryId','publish','typec','contentName']
        result = Util.get_df_by_column(result, columns)
         #merge data
        merge_df = pd.merge(df,result, left_on=["name"] ,right_on=['contentName'],how="outer")
        columns = ['id','scid','categoryId','publish','type','contentName','description','name','typec','uri','name','link','duration','embed','base_link']
        merged_df = Util.get_df_by_column(merge_df, columns)
     
        merged_df['publish'] = merged_df['publish'].replace(np.nan,False)
        merged_df =  merged_df.replace(np.nan,"")
        return build_response(Util.to_dict(merged_df))

    except SecurityException as e:
        return build_security_response([], e)
    except APIValidationError as e:
        return build_custom_err_response([], e)
    except Exception as e:
        return build_err_response([], e)
