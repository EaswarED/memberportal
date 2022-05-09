import pandas as pd
import numpy as np
import time
from datetime import datetime, timedelta
from shared.utilities import constant


class Util:

    @staticmethod
    def to_int(data):
        if data:
            return int(data)
        return None

    @staticmethod
    def to_str(data):
        if data:
            return str(data)
        return None

    @staticmethod
    def to_upper(str):
        if str:
            return str.upper()
        return None

    @staticmethod
    def get_dict_data(dict, key):
        if not dict:
            return None
        if key in dict.keys():
            return dict[key]
        else:
            return None

    @staticmethod
    def get_dict_values(dict_list, key):
        values = list(map(lambda x: x[key], dict_list))
        return values

    @staticmethod
    def to_dict(df):
        if not df.empty:
            df = df.replace(np.nan, '', regex=True)
            return df.to_dict(orient='records')
        return {}

    @staticmethod
    def get_df_by_column(df, columns):
        # if not df.empty or 1==1:
        if 1 == 1:  # TODO: Check if any dataframe creates an issue?
            return df[df.columns.intersection(columns)]
        return df

    @staticmethod
    def get_default_end_date():
        dt = datetime.now() + timedelta(days=30)
        return dt.strftime("%m/%d/%Y")
    @staticmethod
    def get_default_start_date():
        dt = datetime.now() + timedelta(days=1)
        return dt.strftime("%m/%d/%Y")

    @staticmethod
    def get_default_date():
        dt = datetime.now()
        return dt.strftime("%Y-%m-%d")

    @staticmethod
    def get_timestamp():
        dt = datetime.now()
        return dt.strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def get_current_epoch():
        return int(time.time())


    @staticmethod
    def filter_df_by_column(df, column, value):
        if not df.empty:
            return df.loc[df[column] == value]
        return df
        
    @staticmethod
    def get_current_date_epoch():
        curr_dt = datetime.now()
        return int(round(curr_dt.timestamp()))


    @staticmethod
    def filter_df_by_list(df, column, list):
        if not df.empty:
            return df.loc[df[column].isin(list)]
        return df

    @staticmethod
    def filter_df(df, target_list, key, is_equals=True):
        if not target_list:
            return df

        if is_equals == True:
            filtered_df = df[df[key].isin(target_list)]
        else:
            filtered_df = df[~df[key].isin(target_list)]
        return filtered_df

    def df_field_to_int(df, field):
        df[field] = df[field].fillna(0)
        df[field] = df[field].astype('int64')
        return df


    @staticmethod
    def is_valid_access_promotion(df, col_name, target_id):
        df.loc[df[col_name].isnull(), col_name] = df[col_name].apply(lambda d: [])
        # return df[col_name].apply(lambda d: True if (d.count(str(target_id)) > 0) else False)
        return df[col_name].apply(lambda d: True if str(target_id) in d else False)


    @staticmethod
    def listmap_to_df(list):
        items = []
        if list:
            for k, v in list.items():
                dict = {}
                dict['id'] = k
                dict['value'] = v
                items.append(dict)
        return pd.DataFrame(items)

    @staticmethod
    def filter_list(src_list, target_list, key):
        filtered_list = filter(lambda rec: rec[key] in target_list, src_list)
        return list(filtered_list)

    @staticmethod
    def trim_prefix(target_list, prefix):
        values = list(map(lambda x: int(x.replace(prefix, '')), target_list))
        return values

    @staticmethod
    def is_response_200(resp):
        if resp and resp.status_code == 200:
            return True
        return False

    @staticmethod
    def to_lower_key(dict_data):
        new_data = {}
        if isinstance(dict_data, (str, int, float)):
            return dict_data
        if isinstance(dict_data, dict):
            new_data = dict_data.__class__()
            for k, v in dict_data.items():
                new_key = k[0].lower() + k[1:]
                new_data[new_key] = v
        elif isinstance(dict_data, (list, set, tuple)):
            new_data = dict_data.__class__(
                Util.to_lower_key(v) for v in dict_data)
        else:
            return dict_data
        return new_data

    @staticmethod
    def get_path_param(event, name):
        if not event:
            return None
        if 'pathParameters' in event.keys():
            return Util.get_dict_data(event['pathParameters'], name)
        return None

    @staticmethod
    def get_dynamodb_prefix(type):
        if type == constant.CLASS_TYPE_APPT:
            prefix = constant.PREFIX_APPT
        elif type == constant.CLASS_TYPE_CLASS:
            prefix = constant.PREFIX_CLASS
        elif type == constant.CLASS_TYPE_GROUP:
            prefix = constant.PREFIX_CLASS
        elif type == constant.CLASS_TYPE_CONTENT:
            prefix = constant.PREFIX_CONTENT
        else:
            prefix = constant.PREFIX_APPT
        return prefix

    @staticmethod
    def to_split_date(data, startTime, endTime):
        sdates = []
        stimes = []
        sisAMs = []
        edates = []
        etimes = []
        eisAMs = []
        for iso_ts in data:
            date = datetime.strptime(''.join(iso_ts[startTime].rsplit(
                ':', 1)), '%Y-%m-%dT%H:%M:%S%z').date().strftime("%Y-%m-%d")
            time = datetime.strptime(''.join(iso_ts[startTime].rsplit(
                ':', 1)), '%Y-%m-%dT%H:%M:%S%z').time().strftime("%I:%M %p")
            stimes.append(time)
            sdates.append(date)
            edate = datetime.strptime(''.join(iso_ts[endTime].rsplit(
                ':', 1)), '%Y-%m-%dT%H:%M:%S%z').date().strftime("%Y-%m-%d")
            etime = datetime.strptime(''.join(iso_ts[endTime].rsplit(
                ':', 1)), '%Y-%m-%dT%H:%M:%S%z').time().strftime("%I:%M %p")
            etimes.append(etime)
            edates.append(edate)

            isAM = False
            if etime[-2:] == "AM":
                
                isAM = True
                sisAMs.append(isAM)
                eisAMs.append(isAM)
            else:
                isAM = False
                sisAMs.append(isAM)
                eisAMs.append(isAM)
        new_data = {
            'startDate': sdates,
            'Time': stimes,
            'startisAM': sisAMs,
            'endDate': edates,
            'endTime': etimes,
            'endisAM': eisAMs,
        }
        return new_data

    @staticmethod
    def to_split_datetime(data, startTime, endTime, startDate, endDate):
        sdates = []
        stimes = []
        sisAMs = []
        edates = []
        etimes = []
        eisAMs = []
        sdates1 = []
        stimes1 = []
        edates1 = []
        etimes1 = []

        for iso_ts in data:
            date = datetime.strptime(
                ''.join(iso_ts[startTime]), '%Y-%m-%dT%H:%M:%S').date().strftime("%Y-%m-%d")
            time = datetime.strptime(
                ''.join(iso_ts[startTime]), '%Y-%m-%dT%H:%M:%S').time().strftime("%I:%M %p")
            stimes.append(time)
            sdates.append(date)
            date2 = datetime.strptime(
                ''.join(iso_ts[endTime]), '%Y-%m-%dT%H:%M:%S').date().strftime("%Y-%m-%d")
            time2 = datetime.strptime(
                ''.join(iso_ts[endTime]), '%Y-%m-%dT%H:%M:%S').time().strftime("%I:%M %p")
            etimes.append(time2)
            edates.append(date2)
            date1 = datetime.strptime(
                ''.join(iso_ts[startDate]), '%Y-%m-%dT%H:%M:%S').date().strftime("%Y-%m-%d")
            time1 = datetime.strptime(
                ''.join(iso_ts[startDate]), '%Y-%m-%dT%H:%M:%S').time().strftime("%I:%M %p")
            date3 = datetime.strptime(
                ''.join(iso_ts[endDate]), '%Y-%m-%dT%H:%M:%S').date().strftime("%Y-%m-%d")
            time3 = datetime.strptime(
                ''.join(iso_ts[endDate]), '%Y-%m-%dT%H:%M:%S').time().strftime("%I:%M %p")
            edates1.append(date3)
            etimes1.append(time3)
            sdates1.append(date1)
            stimes1.append(time1)

            isAM = False
            print('uuu',time3)
            if time3[-2:] == "AM":
                isAM = True
                sisAMs.append(isAM)
                eisAMs.append(isAM)
            else:
                isAM = False
                sisAMs.append(isAM)
                eisAMs.append(isAM)

        data_array = {
            'startDate': sdates,
            'Time': stimes,
            'stimes':stimes1,
            'startisAM': sisAMs,
            'sDate': sdates1,
            'endDate': edates,
            'eTime': etimes,
            'endisAM': eisAMs,
            'eDate': edates1,
            'etimes':etimes1
        }
        return data_array

    @staticmethod
    def to_split_datetimeformat(data, startDate, time=None):
        sdates = []
        stimes = []
        sisAMs = []
        for iso_ts in data:
            print(iso_ts)
            date = datetime.strptime(
                ''.join(iso_ts[startDate]), '%Y-%m-%dT%H:%M:%S').date().strftime("%Y-%m-%d")
            time = datetime.strptime(
                ''.join(iso_ts[startDate]), '%Y-%m-%dT%H:%M:%S').time().strftime("%I:%M %p")
            stimes.append(time)
            sdates.append(date)

            isAM = False
            if time[-2:] == "AM":
                isAM = True
                sisAMs.append(isAM)
                
            else:
                isAM = False
                sisAMs.append(isAM)
                
        data = {
            'startDate': sdates,
            'Time': stimes,
            'startisAM': sisAMs,
        }
        return data

    @staticmethod
    def to_split_timeformat(data,activeSessionTimes,time):
        sdates = []
        stimes = []
        sisAMs = []
        for iso_ts in data:
            print(iso_ts)
           
            time = datetime.strptime(
                ''.join(iso_ts[activeSessionTimes]), '%H:%M:%S').time().strftime("%I:%M %p")
            stimes.append(time)
           

            isAM = False
            if time[-2:] == "AM":
                isAM = True
                sisAMs.append(isAM)
                
            else:
                isAM = False
                sisAMs.append(isAM)
                
        data = {
            
            'Time': stimes,
            'startisAM': sisAMs,
        }
        return data


    @staticmethod
    def get_query_param(event, name):
        if not event:
            return None
        if 'queryStringParameters' in event.keys():
            return event['queryStringParameters'][name]
        return None
