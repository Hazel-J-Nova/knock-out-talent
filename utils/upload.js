module.exports.upload = s3.upload(params, function(err, data) {
    if (err) {
        throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
});
