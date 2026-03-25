const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws');

async function uploadFileToS3(file) {
  if (!file) return ''; // Khong co anh thi tra ve rong

  const key = `${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3Client.send(command);

  // URL public co ban (bucket can quyen doc public)
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { uploadFileToS3 };
