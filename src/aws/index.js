'use strict';

import fs from 'fs';
import {
  S3Client,
  ListBucketsCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getVideoDurationInSeconds } from 'get-video-duration';
import config from '../config';
import {
  DEFAULT_THUMBNAIL_FILE_EXTENTION,
  DEFAULT_VIDEO_FILE_EXTENTION
} from '../constants';

const { aws } = config.sources;
const {
  accessKeyId,
  secretAccessKey,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  region
} = aws;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    region
  }
});

export const createVideoS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3VideoBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const createThumbnailS3Bucket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName
      };
      await s3Client.send(new CreateBucketCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'createS3Bucket',
        requestId,
        cfId,
        bucketName: s3ThumbnailBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const getFileContentFromPath = (path, isVideo = true) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(path, async (err, buffer) => {
        const content = { file: buffer };
        if (err) {
          reject(err);
        }
        if (isVideo) {
          const duration = await getVideoDurationInSeconds(path);
          content['duration'] = duration;
        }
        resolve(content);
      });
    } catch (err) {
      console.log(`Error getting file: ${path} `, err);
      reject(err);
    }
  });
};

export const doesVideoS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(bucket => bucket.Name === s3VideoBucketName);
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3BucketExist',
        requestId,
        cfId,
        bucketName: s3IssueBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesThumbnailS3BucketExist = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
      const bucket = Buckets.some(
        bucket => bucket.Name === s3ThumbnailBucketName
      );
      resolve(bucket);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3BucketExist',
        requestId,
        cfId,
        bucketName: s3CoverImageBucketName,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesS3ObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesS3ObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyS3Object = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        CopySource: `${s3VideoBucketName}/${oldKey}.${DEFAULT_VIDEO_FILE_EXTENTION}`,
        Key: `${newKey}.${DEFAULT_VIDEO_FILE_EXTENTION}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'copyS3Object',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const getObjectUrlFromS3 = (fileName, isVideo = true) => {
  const bucketName = isVideo ? s3VideoBucketName : s3ThumbnailBucketName;
  const extension = isVideo
    ? DEFAULT_VIDEO_FILE_EXTENTION
    : DEFAULT_THUMBNAIL_FILE_EXTENTION;
  return `https://${bucketName}.s3.amazonaws.com/${fileName}.${extension}`;
};

export const deleteVideoByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const deleteThumbnailByKey = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`
      };
      await s3Client.send(new DeleteObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'deleteVideoByKey',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

const uploadVideoToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3VideoBucketName,
      Key: `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };

    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        queueSize: 7, // optional concurrency configuration
        partSize: '5MB', // optional size of each part
        leavePartsOnError: false, // optional manually handle dropped parts
        params
      });

      parallelUploads3.on('httpUploadProgress', progress => {
        console.log(progress);
      });

      await parallelUploads3.done();
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'uploadVideoToS3',
        requestId,
        cfId,
        extendedRequestId
      });
      console.log(
        `Error uploading file to s3 bucket: ${s3VideoBucketName} `,
        err
      );
      reject(err);
    }
  });
};

const uploadThumbnailToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3ThumbnailBucketName,
      Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read'
    };
    try {
      const parallelUploads3 = new Upload({
        client: s3Client,
        queueSize: 7, // optional concurrency configuration
        partSize: '5MB', // optional size of each part
        leavePartsOnError: false, // optional manually handle dropped parts
        params
      });

      parallelUploads3.on('httpUploadProgress', progress => {
        console.log(progress);
      });

      await parallelUploads3.done();
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'uploadToS3',
        requestId,
        cfId,
        extendedRequestId
      });
      console.log(
        `Error uploading file to s3 bucket: ${s3VideoBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadArchiveToS3Location = async archive => {
  return new Promise(async (resolve, reject) => {
    try {
      const { videoPath, thumbnailPath, key } = archive;
      const { file: videoFile, duration: videoDuration } =
        await getFileContentFromPath(videoPath);
      const { file: thumbnailFile } = await getFileContentFromPath(
        thumbnailPath,
        false
      );
      await uploadVideoToS3(videoFile, key);
      await uploadThumbnailToS3(thumbnailFile, key);
      const videoLocation = getObjectUrlFromS3(key);
      const thumbNailLocation = getObjectUrlFromS3(key, false);
      resolve({ thumbNailLocation, videoLocation, duration: videoDuration });
    } catch (err) {
      console.log(`Error uploading archives to s3 buckets`, err);
      reject(err);
    }
  });
};
