import updateResourceRecord from "./utils/updateResourceRecord";
import { BUCKET } from "./utils/processFiles";
const AWS = require("aws-sdk");

const config = {
  accessKeyId: process.env.AWS_PRESIGN_ACCESS_KEY,
  secretAccessKey: process.env.AWS_PRESIGN_SECRET_KEY,
  region: "us-east-2",
  signatureVersion: "v4",
};

export default async (req, res) => {
  const body = JSON.parse(req.body);

  if (body.Type === "SubscriptionConfirmation") {
    console.info(body);
    new AWS.SNS(config).confirmSubscription(
      {
        TopicArn: body.TopicArn,
        Token: body.Token,
      },
      (err, response) => {
        if (err) {
          console.error(err);
          res.statusCode = 400;
          res.json({ success: false });
          return;
        }
        res.statusCode = 200;
        res.json({ success: true });
        return;
      }
    );
  }

  try {
    // body
    // {
    //   Type: 'Notification',
    //   MessageId: '64e1b161-9374-5bef-ab34-e9eb54107e93',
    //   TopicArn: 'arn:aws:sns:us-east-2:380726684882:AmazonTextract-docusearch-complete',
    //   Message: '{"JobId":"bd59ce3f0779b6e7ac90549fb309611e579c743ae3e0c71285b845b49123c704","Status":"SUCCEEDED","API":"StartDocumentTextDetection","Timestamp":1611711780513,"DocumentLocation":{"S3ObjectName":"1611711768458-08037de167ad7e-Coolest Dream Team - Project 3.pdf","S3Bucket":"docusearch-uploads-test"}}',
    //   Timestamp: '2021-01-27T01:43:00.567Z',
    //   SignatureVersion: '1',
    //   Signature: 'SwIx1EQiznwYuV56VplCurHmdYGAFKNUALccRqfHOymwfBU3IQP6e+v2gFfnxKdPdNkKS1FcbbkJlvIbyAulKhOm0s2Vup8Puv9ncqVMzeAsNhMcGbdgxZyRRMZB0NNEHH99HL/Un23rCkySFxas8fDWVr/bkUVS2JWf3qDZN24lYrlbk72ldZXr6RRmgSMelXUidg8DguA+Dsg547spzl8dK0mPQ0iaj4/GXhFNZTcNWvX3qFM4vRYIIHtSpnQgrpQN2Nr6TfNbH7QRP4ZekNO8HcV4IyAb4B2x47CPC2tiYb5a167AFvGFgLn4FFIiXDTHNBsAlu//xABkC/W1pg==',
    //   SigningCertURL: 'https://sns.us-east-2.amazonaws.com/SimpleNotificationService-010a507c1833636cd94bdb98bd93083a.pem',
    //   UnsubscribeURL: 'https://sns.us-east-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-east-2:380726684882:AmazonTextract-docusearch-complete:21e1cf4a-8d86-4f7e-b983-f2f370a24f2f'
    // }
    const message = JSON.parse(body.Message);
    const resource =
      "https://" +
      BUCKET +
      ".s3.us-east-2.amazonaws.com/" +
      message.DocumentLocation.S3ObjectName;

    if (message.Status !== "SUCCEEDED") {
      throw "Textract Incomplete: JobId: " + message.JobId;
    }

    var params = {
      JobId: message.JobId,
    };

    // const file = fs.createWriteStream("./temp/" + key);
    var textract = new AWS.Textract(config);
    // start Textract and publush resuls to sns
    textract.getDocumentTextDetection(params, async function (err, data) {
      if (err) {
        console.error(err, err.stack);
        // an error occurred
        throw err;
      }
      // get all the single words, not lines
      data = data.Blocks.filter((block) => {
        if (block.BlockType === "WORD") {
          return block.Text;
        }
      }).map((block) => block.Text);

      await updateResourceRecord(resource, data);

      // TODO: ping user somehow to let them know that an extraction is complete?

      res.statusCode = 200;
      res.json({ success: true });
      return;
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 400;
    res.json({ success: false, error: e });
    return;
  }
};
