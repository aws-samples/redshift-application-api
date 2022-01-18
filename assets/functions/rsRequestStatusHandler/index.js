console.log('Loading function');
const AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
exports.handler = async(event,context,callback) => {
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var response;
    console.log(event.params.header);
    var requestid = event.params.header['requestid'];
    var type = event.params.header['type'];
    console.log(requestid);
   
    var params_latest = {
    ExpressionAttributeValues: {
    ':s': {S: requestid}
    },
    KeyConditionExpression: 'requestid = :s',
    ScanIndexForward: false,
    Limit: 1,
    TableName: process.env.STATUS_TABLE_NM
    };
    var params_all = {
    ExpressionAttributeValues: {
    ':s': {S: requestid}
    },
    KeyConditionExpression: 'requestid = :s',
    ScanIndexForward: false,
    Limit: 10,
    TableName: process.env.STATUS_TABLE_NM
    };
if (type =='latest')
{
    try{
        var result = await ddb.query(params_latest).promise();
        response = result.Items;
         console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}
else
{
    try{
        var result = await ddb.query(params_all).promise();
        response = result.Items;
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}
return response;
};
