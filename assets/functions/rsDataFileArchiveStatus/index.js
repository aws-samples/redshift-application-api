console.log('Loading function');
const AWS = require("aws-sdk");

const lambda = new AWS.Lambda({ region: 'us-east-1'});
exports.handler = (event, context, callback) => {
    console.log(event);
    var datetime = new Date().getTime().toString();
    
    var filename = event['Records'][0]['s3']['object']['key'].split('/')[0];
    var requestid =event['Records'][0]['s3']['object']['key'].split('/')[0].split('.')[0];
    console.log(requestid);
    console.log(filename);
    load_table(process.env.STATUS_TABLE_NM,requestid ,'Success','Redshift Data File Archive','',datetime,callback);

    const s3Object = new AWS.S3({
    apiVersion: "2006-03-01",signatureVersion:"v4"
     });
 
    const bucketparams = { Bucket: process.env.BUCKET_NAME, Key: filename, Expires: parseInt(process.env.EXPIRY_TIME) };
    s3Object.getSignedUrl('getObject', bucketparams, function(err, url) {
    //console.log(url);
    var responseBody = url;
    console.log(JSON.stringify(responseBody));
    if(err == null || !err)
    {
        console.log("I am here");
        var params = {
    Destination: {
      ToAddresses: [process.env.TARGET_EMAIL],
    },
    Message: {
      Body: {
        Text: { Data: "Please use the below link to download the file"+"\n"+ responseBody },
      },

      Subject: { Data: "Data for Request ID "+requestid+" is available for download!" },
    },
    Source: process.env.SOURCE_EMAIL,
    };
        // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
        console.log(JSON.stringify(responseBody));
        sendPromise.then(
          function(data) {
            console.log(data.MessageId);
            load_table(process.env.STATUS_TABLE_NM,requestid ,'Success','Email sent to download the file','',datetime,callback);
          }).catch(
            function(err) {
            console.error(err, err.stack);
          });
    }
    else
    {
        console.log(new Error(err));
        load_table(process.env.STATUS_TABLE_NM,requestid ,'Error',new Error(err),'',datetime,callback);
    }
});

    
    
    function load_table(table_name,requestid,status,stage,message,requesttime,callback)
    {
        /* This example adds a new item the dynamodb table. */
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
