'use strict';

import fs from 'fs';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  ListObjectsCommand
} from '@aws-sdk/client-s3';
const { AbortController } = require('@aws-sdk/abort-controller');
import config from '../config';

const { aws } = config.sources;
const { accessKeyId, secretAccessKey, s3BucketName, region } = aws;

const abortController = new AbortController();

const s3Client = new S3Client({
  accessKeyId,
  secretAccessKey,
  region
});

export const createS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName
      };
      const data = await s3Client.send(new CreateBucketCommand(params), {
        abortSignal: abortController.signal
      });
      resolve(data);
    } catch (err) {
      console.log(`Error creating bucket: ${s3BucketName} `, err);
      abortController.abort();
      reject(err);
    }
  });
};

export const doesS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3BucketName
      };
      const data = await s3Client.send(new HeadBucketCommand(params), {
        abortSignal: abortController.signal
      });
      resolve(data);
    } catch (err) {
      abortController.abort();
      console.log(`Error checking status of bucket: ${s3BucketName} `, err);
      if (err.statusCode > 400) {
        reject(err);
      }
      reject(err);
    }
  });
};

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
      fs.readFile(path, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
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
      fileContent = await getFileContent(filepath, name);
    }
    if (url) {
      fileContent = await getFileContentFromUrl(tmpArchivePath, url);
    }

    try {
      const location = await uploadToS3(fileContent, name);
      if (url) {
        fs.unlinkSync(tmpArchivePath);
      }
      resolve(location);
    } catch (err) {
      console.log(`Error uploading archive to s3 bucket: ${file} `, err);
      reject(err);
    }
  });
};
