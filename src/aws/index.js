'use strict';

import AWS from 'aws-sdk';
import config from '../config';

const { aws } = config.sources;
const { accessKeyId, secretAccessKey, s3BucketName, region } = aws;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
});

export const createS3Bucket = () => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: s3BucketName,
      CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: region
      }
    };

    s3.createBucket(params, function (err) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      }
      resolve();
    });
  });
};

export const doesS3BucketExist = async () => {
  const options = {
    Bucket: s3BucketName
  };
  try {
    await s3.headBucket(options).promise();
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      return false;
    }
    throw error;
  }
};

export const getFileContent = async (archivePath, url) => {
  const file = fs.createWriteStream(archivePath);
  https.get(url, function (response) {
    response.pipe(file);
  });
};

export const uploadArchiveToS3Location = async file => {
  return new Promise((resolve, reject) => {
    const { name, url } = file;
    // Read content from the file
    const tmpArchivePath = `./tmp/${name}.zip`;
    const fileContent = await getFileContent(tmpArchivePath, url);

    // Setting up S3 upload parameters
    const params = {
      Bucket: s3BucketName,
      Key: name, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      }
      try {
        fs.unlinkSync(tmpArchivePath);
        //file removed
        resolve(data.Location);
      } catch (err) {
        reject(err);
      }
    });
  });
};
