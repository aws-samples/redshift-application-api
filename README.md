## AWS Redshift Data API
## Perquisites

## You need the following perquisites to deploy the example application:
- [AWS account](https://aws.amazon.com/free/?trk=ps_a134p000003yBfsAAE&trkCampaign=acq_paid_search_brand&sc_channel=ps&sc_campaign=acquisition_US&sc_publisher=google&sc_category=core&sc_country=US&sc_geo=NAMER&sc_outcome=acq&sc_detail=%2Baws%20%2Baccount&sc_content=Account_bmm&sc_segment=438195700994&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|AWS|Core|US|EN|Text&s_kwcid=AL!4422!3!438195700994!b!!g!!%2Baws%20%2Baccount&ef_id=Cj0KCQjwsuP5BRCoARIsAPtX_wEmxImXtbdvL3n4ntAafj32KMc_sXL9Z-o8FyXVQzPk7w__h2FMje0aAhOFEALw_wcB:G:s&s_kwcid=AL!4422!3!438195700994!b!!g!!%2Baws%20%2Baccount&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Python 3.9](https://www.python.org/downloads/)
- [Node 17.3](https://www.npmjs.com/package/homebrew)
- [An AWS Identity and Access Management (IAM)](http://aws.amazon.com/iam) role with appropriate access.	
- An [Amazon Redshift cluster](https://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-launch-sample-cluster.html) with a database and table
- Run the following DDL on the Amazon Redshift cluster using query editor to create the schema and table:

` create schema rsdataapi;`
```
create table rsdataapi.product_detail(
 sku varchar(20)
,product_id int 
,product_name varchar(50)
,product_description varchar(50)
);
```

```
Insert into rsdataapi.product_detail values ('FLOWER12',12345,'Flowers - Rose','Flowers-Rose');
Insert into rsdataapi.product_detail values ('FLOWER13',12346,'Flowers - Jasmine','Flowers-Jasmine');
Insert into rsdataapi.product_detail values ('FLOWER14',12347,'Flowers - Other','Flowers-Other');
```



- Secrets Manager [configured](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html) to store Amazon Redshift credentials 
- Amazon SES [configured](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-set-up.html) with an email address or distribution list to send and receive status updates


## To Deploy the sample application run the following steps:
1.	Clone the repository and download the sample source code to your environment where AWS SAM is installed:
`git clone https://github.com/aws-samples/redshift-application-api.git`

2.	Change into the project directory containing the template.yaml file:
```
cd aws-samples/redshift-application-api/assets
export PATH=$PATH:/usr/local/opt/python@3.8/bin  
```

3.	Change the API yaml file to update your AWS account number and the region where you will deploy this solution

```
sed -i ‘’ “s/<input_region>/us-east-1/g” *API.yaml
sed -i ‘’ “s/<input_accountid>/<provide your AWS account id without dashes>/g” *API.yaml
```



4.	Build the application using AWS SAM:
`sam build`

5. `sam deploy -g`

| Parameter | Description |
| ------ | ------ |
| RSClusterID | The cluster identifier for your existing Amazon Redshift cluster |
| RSDataFetchQ | The query to fetch the data from your Amazon Redshift tables (for example, select * from rsdataapi.product_detail where sku= The input will be passed from the API) |
| RSDataFileS3BucketName | The S3 bucket where the dataset from Amazon S3 is uploaded |
| RSDatabaseName | The database on your Amazon Redshift cluster |
| RSS3CopyRoleArn |	The IAM role for Amazon Redshift that has access to copy files to and from Amazon Redshift to Amazon S3. This role should be associated with your Amazon Redshift cluster |
| RSSecret | The Secrets Manager ARN for your Amazon Redshift credentials |
| RSUser | The user name to connect to the Amazon Redshift cluster |
| RsFileArchiveBucket | The S3 bucket from where the zipped dataset is downloaded. This should be different than your upload bucket |
| RsS3CodeRepo | The S3 bucket where the packages or zip file is stored |
| RsSingedURLExpTime | The expiry time in seconds for the presigned URL to download the dataset from Amazon S3 |
| RsSourceEmailAddress | The email address of the distribution list for which Amazon SES is configured to use as the source for sending completion status |
| RsTargetEmailAddress | The email address of the distribution list for which Amazon SES is configured to use as the destination for receiving completion status |
| RsStatusTableName | The name of the status table for capturing the status of various stages from start to completion of request |

&nbsp;

## License Summary

This sample code is made available under a modified MIT license. See the LICENSE file.

&nbsp;

## Outline
## Questions and contact

For questions on Redshift application API, or to contact the team, please leave a comment on GitHub.
