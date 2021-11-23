const AWS = require('aws-sdk')


exports.handler = (event, context, callback) => {
    // TODO implement


    //Remove JSON.parse whie runing from cloud 9
    //Put JSON.parse while running on actual server

    //Print the events
    console.log(event);
    console.log(event['Records'][0]['s3']);

    //Uncomment below line while moving to actual env
    var _fileprefix = event['Records'][0]['s3']['object']['key'].split('/')[0];
    var _bucket = event['Records'][0]['s3']['bucket']['name'];
    var _trigfile = event['Records'][0]['s3']['object']['key'];


    //Uncomment below  when using cloud 9
    //var _fileprefix = event['Records'][0]['body']['Records'][0]['s3']['object']['key'].split('/')[0];
    //var _bucket = event['Records'][0]['body']['Records'][0]['s3']['bucket']['name'];
    //var _trigfile = event['Records'][0]['body']['Records'][0]['s3']['object']['key'];    

    console.log(_trigfile);
    console.log(event);

    const _filename = _fileprefix + process.env.FILE_EXTN;
    var _targetBucket = process.env.TARGET_BUCKET_NAME;


    AWS.config.update({ region: process.env.REGION });
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    


    const params = {
        Bucket: _bucket,
        Key: _trigfile
    };

    //Removing the trigger file 
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });

    const tarparams = {
        Bucket: _targetBucket,
        Key: _filename

    };

    const s3Archiver = require('lambda-s3-archiver');

    s3Archiver.archive(_bucket, _fileprefix, [], _fileprefix, process.env.FILE_EXTN, tarparams, function(err,data){
    if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); // successful response
    });
    




}