from DbClient import DbClient
import json
import boto3
import uuid
from boto3.dynamodb.conditions import Key,Attr
from datetime import datetime, timezone

class ReasonsDbClient(DbClient):
    def __init__(self):
        dynamodb = boto3.resource('dynamodb')
        self.table = dynamodb.Table('Reasons')

    # Get Items based on specific criteria
    def QueryItems(self, seen):
        scan_kwargs = {
            'FilterExpression': Key('seen').eq(seen),
            'ProjectionExpression': "reason, reasonId",
        }
        
        return self.table.scan(**scan_kwargs)['Items']
    
    def QueryItem(self, seen):
        items = self.QueryItems(seen)

        if items:
            return items[0]
        
        return None
    
    def GetItem(self, key):
        return self.table.query(
            ProjectionExpression="reason, reasonId, seen",
            KeyConditionExpression=
                Key('reasonId').eq(key))['Items']

    def InsertItem(self, item):
        return self.table.put_item(Item = item)    

    def CreateItem(self, reason, toUser, fromUser):
        return {
            'reasonId': str(uuid.uuid4()), 
            'reason': reason, 
            'seen': False,
            'createdTime' : datetime.now(timezone.utc).isoformat(),
            'lastUpdatedTime' : datetime.now(timezone.utc).isoformat(),
            'to' : toUser,
            'from': fromUser
        }

    def UpdateItem(self, key, seen):
        item = self.GetItem(key)
        if not item:
            raise Exception("{0} is not present".format(key)) 
        
        return self.table.update_item(
            Key={'reasonId': key},
            UpdateExpression="set seen = :s, lastUpdatedTime = :u",
            ExpressionAttributeValues= {':s': seen, ':u' : datetime.now(timezone.utc).isoformat() })
    
    def DeleteItem(self, item):
        pass
