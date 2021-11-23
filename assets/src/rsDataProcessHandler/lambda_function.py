import json
import boto3
import os
import time
import sys

def lambda_handler(event, context):
    print(event)
    input_mssg = event['Records'][0]['body']
    #input_msg = json.dumps(input_mssg)
    input_msg = json.loads(input_mssg)
    mssg_prop = event['Records'][0]['attributes']
    input_msg_prop = mssg_prop
    queue_entry_timestamp = input_msg_prop['SentTimestamp']
    queue_exit_timestamp = input_msg_prop['ApproximateFirstReceiveTimestamp']
    create_date = input_msg['createdate']
    print(create_date)
    productname = input_msg['productname']
    sku = input_msg['sku']
    requestid = input_msg['requestid']
    if input_msg_prop is not None:
       msg_body = {}
       msg_body['requestid'] = requestid
       msg_body['stepname'] = 'Message Recieved - SQS'
       msg_body['timestamp'] = queue_entry_timestamp
       msg_body['status'] = 'Success'
       msg_body['message'] = ''
       load_status(msg_body)
       #msg_body_1 = '{"requestid":"'+requstid+'","stepname":"Message Sent - SQS","timestamp":"'+queue_exit_timestamp+'","status":"Success"}'
       msg_body_1 = {}
       msg_body_1['requestid'] = requestid
       msg_body_1['stepname'] = 'Message Sent - SQS'
       msg_body_1['timestamp'] = queue_exit_timestamp
       msg_body_1['status'] = 'Success'
       msg_body_1['message'] = ''
       load_status(msg_body_1)
    if sku is not None:
        #update_status(requestid)
        msg_body_1 = {}
        msg_body_1['requestid'] = requestid
        msg_body_1['stepname'] = 'Query Request Recieved - Redshift'
        msg_body_1['timestamp'] = int(time.time())
        msg_body_1['status'] = 'Success'
        msg_body_1['message'] = ''
        rsdata = boto3.client('redshift-data')
        load_status(msg_body_1)
        try:
            response = rsdata.execute_statement(
            ClusterIdentifier=os.environ['rs_cluster_id'],
            Database=os.environ['database_name'],
            SecretArn=os.environ['secret_arn'],
            #Sql="unload ('select * from rsdataapi.product_detail where sku=''"+sku+"''') to 's3://rsdataresult03/"+requestid+"/' iam_role 'arn:aws:iam::493089398351:role/RedshiftRoleDemo' header CSV manifest",
            Sql="unload ('"+os.environ['rs_sql']+"''"+sku+"''') to 's3://"+os.environ['rs_result_bucket']+"/"+requestid+"/' iam_role '"+os.environ['rs_iam_role_arn']+"' header CSV manifest",
            StatementName='find products',
            WithEvent=False
            )
            msg_body_1 = {}
            msg_body_1['requestid'] = requestid
            msg_body_1['stepname'] = 'Query Request Processed - Redshift'
            msg_body_1['timestamp'] = int(time.time())
            msg_body_1['status'] = 'Success'
            msg_body_1['message'] = ''
            load_status(msg_body_1)
        except:
            e = str(sys.exc_info()[1])
            print(type(e))
            msg_body_1 = {}
            msg_body_1['requestid'] = requestid
            msg_body_1['stepname'] = 'Query Response Recieved - Redshift'
            msg_body_1['timestamp'] = int(time.time())
            msg_body_1['status'] = 'Error'
            msg_body_1['message'] = e
            load_status(msg_body_1)
     

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def update_status(requestid, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ.get('status_table_name'))
    #for input in request:
    response = table.update_item(
        Key={
            'requestid': requestid
        },
        UpdateExpression="set request_status=:s",
        ExpressionAttributeValues={
            ':s': os.environ.get('progress_status')
            
        },
        ReturnValues="UPDATED_NEW"
    )
    return response

def load_status(request, dynamodb=None):
    requestid=request['requestid']
    stepname=request['stepname']
    timestamp=str(request['timestamp'])
    status=request['status']
    message=request['message']
    print(message)
    if not dynamodb:
        dynamodb = boto3.client('dynamodb')
    dynamodb.put_item(TableName=os.environ.get('status_table_name'),Item={'requestid':{'S':requestid}, 'stepname': {'S':stepname}, 'timestamp':{'S':timestamp}, 'status': {'S':status}, 'message': {'S' :message}})
    
    
