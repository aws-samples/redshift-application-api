var AWS = require('aws-sdk');;
exports.handler = (event, context, callback) => {

 console.log(event);
 console.log(event['queryStringParameters']);
 const request_id = event['queryStringParameters']['requestid']
 console.log(request_id);

 const s3Object = new AWS.S3({
 apiVersion: "2006-03-01",signatureVersion:"v4"
 });
 const filename =  request_id + process.env.FILE_EXTENSION;
 console.log(filename);
 const bucketparams = { Bucket: process.env.BUCKET_NAME, Key: filename, Expires: parseInt(process.env.EXPIRY_TIME) };
 const headerbparams = { Bucket: process.env.BUCKET_NAME, Key: filename}
 s3Object.headObject(headerbparams, function (err, metadata) {  
  if (err) {  
   var mssg_body = {"status": "File is not ready!,Please try after sometime!!"};
   var mssg_response = {"statusCode": 200,"headers": {"rsdataresult": "status"},"body": JSON.stringify(mssg_body), "isBase64Encoded": false};
   callback(null,mssg_response);
  } else {  
    s3Object.getSignedUrl('getObject', bucketparams, function(err, url) {
 console.log(err);
 console.log(url);
  var responseBody = {
        "location": url,
    
    };

    var response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
 
 
 if(!err)
 {
    callback(null,response);
 }
 else
 {
    callback(new Error(err));
 }

 });
  }
});
 
 
 
 

};
