import updateResourceRecord from "./updateResourceRecord";

const AWS = require("aws-sdk");
const config = {
  accessKeyId: process.env.AWS_PRESIGN_ACCESS_KEY, // Generated on step 1
  secretAccessKey: process.env.AWS_PRESIGN_SECRET_KEY, // Generated on step 1
  region: "us-east-2", // Must be the same as your bucket
  signatureVersion: "v4",
};

export const BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET;
// If image is of type text/* we can analyze it directly ourselves, just need to get it from AWS first
export async function processTextFile(url, type) {
  // get file from aws
  const key = url.replace(
    "https://" + BUCKET + ".s3.us-east-2.amazonaws.com/",
    ""
  );

  const params = {
    Bucket: BUCKET,
    Key: key,
  };

  let file = await new AWS.S3(config).getObject(params).promise();
  let text = file.Body.toString("utf-8");

  updateResourceRecord(url, text.split(" "));
}

// If file is PDF, PNG, or JPG start AWS Textract request
export function processWithTextract(url) {
  const key = url.replace(
    "https://" + BUCKET + ".s3.us-east-2.amazonaws.com/",
    ""
  );

  var params = {
    DocumentLocation: {
      S3Object: {
        Bucket: BUCKET,
        Name: key,
      },
    },
    NotificationChannel: {
      RoleArn: process.env.UPLOADER_ROLE_ARN,
      SNSTopicArn: process.env.SNS_ARN,
    },
  };

  var textract = new AWS.Textract(config);
  // start Textract -> results are published to SNS
  textract.startDocumentTextDetection(params, function (err, data) {
    if (err) {
      console.error(err, err.stack);
      // an error occurred
    }
  });
}
