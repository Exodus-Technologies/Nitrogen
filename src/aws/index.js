'use strict';

import fs from 'fs';
import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand
} from '@aws-sdk/client-s3';
import config from '../config';

const { aws } = config.sources;
const { accessKeyId, secretAccessKey, s3BucketName, region } = aws;

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
      const data = await s3Client.send(new CreateBucketCommand(params));
      resolve(data);
    } catch (err) {
      console.log(`Error creating bucket: ${s3BucketName} `, err);
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
      const data = await s3Client.send(new HeadBucketCommand(params));
      resolve(data);
    } catch (err) {
      console.log(`Error checking status of bucket: ${s3BucketName} `, err);
      if (error.statusCode === 404) {
        reject(error);
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
      reject(err);
    }
  });
};

const getFileContent = (path, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fullPath = `${path}/${name}`;
      fs.readFile(fullPath, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
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
      s3.upload(params, function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data.Location);
      });
    } catch (err) {
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
    } catch (error) {
      reject(err);
    }
  });
};
