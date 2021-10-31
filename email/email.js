const nodemailer = require("nodemailer");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const REGION = "us-east-2"; //e.g. "us-east-1"

const sesClient = new SESClient({ region: REGION });

// Set the parameters
module.exports.buildParams = (recipient, htmlBody, textBody) => {
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        recipient, //RECEIVER_ADDRESS
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: recipient, // SENDER_ADDRESS
    ReplyToAddresses: [
      /* more items */
    ],
  };
  return params;
};

module.exports.sendConfirmationEmail = async (params) => {
  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Success", data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};
