require('dotenv').config()
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3')
const multer = require("multer")



// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
AWS.config.update({region: REGION, accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
const s3 = new AWS.S3();

    
 

    const presignedGETURL = s3.getSignedUrl('getObject', {
      Bucket: process.env.Bucket,
      Key: "6144d58fb342caa2c1749477", //filename
      Expires: 10000 //time to expire in seconds
  });




     module.exports.upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString())
        }
      })
    })
    



module.exports.createObject = async (params) => {

  try {
    const results = await s3.send(new PutObjectCommand(params));
    console.log(
        "Successfully created " +
        params.Key +
        " and uploaded it to " +
        params.Bucket +
        "/" +
        params.Key
    );
    return results; // For unit tests.
  } catch (err) {
  }

}


module.exports.getObject = async (params) => {
    try {
      // Create a helper function to convert a ReadableStream to a string.
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
  
      // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
      const data = await s3.send(new GetObjectCommand(params));
        return data; // For unit tests.
      // Convert the ReadableStream to a string.
      const bodyContents = await streamToString(data.Body);
        return bodyContents;
    } catch (err) {
    }
  };



