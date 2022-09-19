import json
import boto3
import random
from ReasonsDbClient import ReasonsDbClient


def lambda_handler(event, context):
    client = ReasonsDbClient()
    response = []

    method = event.get('method')

    try:
        if method == 'GET':
            response = GET(event, context, client)
        elif method == 'POST':
            response = POST(event, context, client)
        elif method == 'PUT':
            response = PUT(event, context, client)
        else:
            raise Exception("Unknown method: {0}".format(method))
    except Exception as e:
        return {
        'statusCode': 500,
        'body': json.dumps(event)
        }

    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }

def GET(event, context, client):
    response = []

    # GET PATH PARAMETERS
    pathParam = event.get('params', {})

    # GET QUERY PARAMETERS
    reasonId = pathParam.get('reasonId', None)
    queryParams = event.get('query', {})

    if reasonId is not None:
        response = client.GetItem(reasonId)
    else:
        count = int(queryParams.get('count', 1))
        seen = json.loads(queryParams.get('seen', "false").lower())
        data = client.QueryItems(seen)
        if data:
            response = random.sample(data, min(count, len(data)))

    return response

def POST(event, context, client):
    item = client.CreateItem(event['body']['reason'].lower(), "catherine".lower(), "omar".lower())
    client.InsertItem(item)
    return "Created reason:{0}".format(event['body']['reason'])

def PUT(event, context, client):
    reasonId = event['params']['reasonId']
    seen = event['body']['seen']
    result = client.UpdateItem(key=reasonId,seen=seen)
    return "Updated: {0}".format(reasonId)