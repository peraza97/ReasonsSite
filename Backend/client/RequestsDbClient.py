from DbClient import DbClient
import json
import boto3
import uuid
from boto3.dynamodb.conditions import Key,Attr
from datetime import datetime, timezone

class RequestsDbClient(DbClient):
    def __init__(self):
        dynamodb = boto3.resource('dynamodb')
        self.table = dynamodb.Table('Requests')

    # Get Items based on specific criteria
    def QueryItems(self, complete):
        scan_kwargs = {
            'FilterExpression': Key('complete').eq(complete),
            'ProjectionExpression': "requestTask, requestId, complete",
        }
        
        return self.table.scan(**scan_kwargs)['Items']

    def QueryItem(self, **kwargs):
        pass
    
    def GetItem(self, key):
        return self.table.query(
            ProjectionExpression="requestTask, requestId, complete",
            KeyConditionExpression=
                Key('requestId').eq(key))['Items']

    def InsertItem(self, item):
        return self.table.put_item(Item = item)    

    def CreateItem(self, request, toUser):
        return {
            'requestId': str(uuid.uuid4()), 
            'requestTask': request, 
            'complete': False,
            'createdTime' : datetime.now(timezone.utc).isoformat(),
            'lastUpdatedTime' : datetime.now(timezone.utc).isoformat(),
            'assignedTo' : toUser
        }

    def UpdateItem(self, key, complete):
        item = self.GetItem(key)
        if not item:
            raise Exception("{0} is not present".format(key)) 
        
        return self.table.update_item(
            Key={'requestId': key},
            UpdateExpression="set complete = :s, lastUpdatedTime = :u",
            ExpressionAttributeValues= {':s': complete, ':u' : datetime.now(timezone.utc).isoformat() })
    
    def DeleteItem(self, key):
        item = self.GetItem(key)
        if not item:
            raise Exception("{0} is not present".format(key))
        return self.table.delete_item(Key={'requestId': key})
