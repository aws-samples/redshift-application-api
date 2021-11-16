console.log('Loading function');
const AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log(event);
    var datetime = new Date().getTime().toString();
    event['requestid'] = context.awsRequestId 
    const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
    const response=sqs.sendMessage({
    MessageBody: JSON.stringify(event),
    QueueUrl: process.env.QUEUE_URL // TODO
    }, (err, data) => (err) ? callback(load_table('rsdata_status_check',context.awsRequestId,'Error','API Request Call',String(err),datetime,callback)) : callback(load_table('rsdata_status_check',context.awsRequestId ,'Success','API Request Call',JSON.stringify(event),datetime,callback)));
    console.log(response);
    
    function load_table(table_name,requestid,status,stage,message,requesttime,callback)
    {
        /* This example adds a new item to the Music table. */
        var dynamodb = new AWS.DynamoDB();
        var params = {
            Item: {
                requestid: {
                    S: requestid
                    },
                stepname: {
                    S: stage
                    },
                status: {
                    S: status
                    },
                timestamp: {
                    S: requesttime
                    },
                message: {
                    S: message
                }
                   
            }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: table_name,
        };
        //dynamodb.putItem(params,callback);
        console.log(params);
        dynamodb.putItem(params,(err,data) => err? console.log(err) : console.log(data));
        
        callback(null,requestid);
        
       
    }
};
