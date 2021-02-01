const AWS = require("aws-sdk");

module.exports.createPresignedPost = async function createPresignedPost({
  key,
  type,
}) {
  AWS.config.update({
    accessKeyId: process.env.AWS_PRESIGN_ACCESS_KEY, // Generated on step 1
    secretAccessKey: process.env.AWS_PRESIGN_SECRET_KEY, // Generated on step 1
    region: "us-east-2", // Must be the same as your bucket
    signatureVersion: "v4",
  });

  const params = {
    Bucket: "docusearch-uploads-test",
    ContentType: type + "; charset=utf-8",
    ACL: "public-read",
    Key: key,
    Expires: 60,
  };

  const endpoint = "docusearch-uploads-test.s3-accelerate.amazonaws.com";

  const options = {
    signatureVersion: "v4",
    region: "us-east-2", // same as your bucket
    endpoint: new AWS.Endpoint(endpoint),
    useAccelerateEndpoint: true,
  };
  const client = new AWS.S3(options);

  const signedURL = await new Promise((resolve, reject) => {
    client.getSignedUrl("putObject", params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  return signedURL;
};
