import json


def get_data(event, context):
    json_file = 'appointment/landing/appts'
    if event:
        json_file = event['path']

    json_file = json_file[1:] + ".json"

    with open(json_file, 'r') as file_obj:
        json_data = json.load(file_obj)

    

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps(json_data),
    }
