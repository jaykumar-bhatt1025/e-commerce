const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secrectKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKey,
  secrectKey,
});

const upload = (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    ACL: 'public-read',
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

const deleteFileS3 = (filePath) => {
  const fileKey = filePath.slice(process.env.AWS_BUCKET_URL.length);
  const uploadParams = {
    Bucket: bucketName,
    Key: fileKey,
  };

  return s3.deleteObject(uploadParams).promise();
};

module.exports = { upload, deleteFileS3 };
