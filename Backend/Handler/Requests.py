import json
import boto3
import random
from RequestsDbClient import RequestsDbClient


def lambda_handler(event, context):
    client = RequestsDbClient()
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
        'body': json.dumps(e, default=str)
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
    requestId = pathParam.get('requestId', None)
    queryParams = event.get('query', {})

    if requestId is not None:
        response = client.GetItem(requestId)
    else:
        count = int(queryParams.get('count', 1))
        complete = json.loads(queryParams.get('complete', "false").lower())
        response = client.QueryItems(complete)
    return response

def POST(event, context, client):
    item = client.CreateItem(event['body']['request'].lower(), "omar".lower())
    client.InsertItem(item)
    return "Created request:{0}".format(event['body']['request'])

def PUT(event, context, client):
    reasonId = event['params']['requestId']
    seen = event['body']['complete']
    result = client.UpdateItem(key=requestId,complete=complete)
    return "Updated: {0}".format(requestId)