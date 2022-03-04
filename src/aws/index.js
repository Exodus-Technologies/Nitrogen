'use strict';

import fs from 'fs';
import {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3';
import config from '../config';

const { aws } = config.sources;
const { accessKeyId, secretAccessKey, s3BucketName, region } = aws;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    region
  }
});

const getFileContentFromUrl = (archivePath, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = fs.createWriteStream(archivePath);
      https.get(url, function (response) {
        response.pipe(file);
        resolve();
      });
    } catch (err) {
      console.log(`Error getting file from url: ${url} `, err);
      reject(err);
    }
  });
};

const getFileContent = path => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.readFile(path, function (err, buffer) {
        if (err) {
          reject(err);
        }
        resolve(buffer.toString());
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const doesS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3BucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({ requestId, cfId, extendedRequestId });
      reject(err);
    }
  });
};

export const getObjectFromS3 = fileName => {
  return `https://${s3BucketName}.s3.amazonaws.com/${fileName}`;
};

export const createS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName
      };
      const data = await s3Client.send(new CreateBucketCommand(params));
      if (data.Location) {
        resolve();
      }
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({ requestId, cfId, extendedRequestId });
      reject(err);
    }
  });
};

const uploadToS3 = (fileContent, name) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3BucketName,
      Key: name, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };
    try {
      const data = await s3Client.send(new PutObjectCommand(params));
      resolve(data);
    } catch (err) {
      console.log(`Error uploading file to s3 bucket: ${s3BucketName} `, err);
      reject(err);
    }
  });
};

export const uploadArchiveToS3Location = async file => {
  return new Promise(async (resolve, reject) => {
    const { name, url, filepath } = file;
    // Read content from the file
    const tmpArchivePath = `./tmp/${name}.mp4`;
    let fileContent = '';
    if (filepath) {
      fileContent = await getFileContent(filepath);
    }
    if (url) {
      fileContent = await getFileContentFromUrl(tmpArchivePath, url);
    }

    try {
      await uploadToS3(fileContent, name);
      const fileLocation = getObjectFromS3(name);
      if (url) {
        fs.unlinkSync(tmpArchivePath);
      }
      resolve(fileLocation);
    } catch (err) {
      console.log(`Error uploading archive to s3 bucket: ${file} `, err);
      reject(err);
    }
  });
};
