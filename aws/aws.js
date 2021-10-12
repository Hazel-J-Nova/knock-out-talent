require('dotenv').config()
const { S3 } = require( "@aws-sdk/client-s3")
const multerS3 = require('multer-s3')
const multer = require("multer")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { PutObjectCommand,S3Client,  GetObjectCommand }  = require("@aws-sdk/client-s3")

// Set the AWS Region.
const REGION = "us-east-2"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Credentials = {region: REGION, GrantFullControl:process.env.AWS_SECRET_ACCESS_KEY}
const s3 = new S3Client({s3Credentials});

const params = {Bucket: process.env.Bucket,
  Key: "6156eceed265dfabac1c75f2"
}

module.exports.downloadURL = (async(params) =>{
  const command = (new GetObjectCommand(params))
  const url =await (getSignedUrl(s3, command, { expiresIn: 3600 }));
  return url
})

const makeobject =(async()=>{ 
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

})

 
 

    module.exports.presignedGETURL = ( (key)=>{
      s3.getSignedUrl('getObject', 
      {
      Bucket: process.env.Bucket,
      Key: key, //filename
      Expires: 100000 //time to expire in seconds
  })
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
  } catch (err) { console.log(err)
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
      console.log(bodyContents)
        return bodyContents;
    } catch (err) {
    }
  };



