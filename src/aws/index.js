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
import { getThumbnailContentFromPath } from '../utilities';

const {
  accessKeyId,
  secretAccessKey,
  region,
  s3VideoBucketName,
  s3ThumbnailBucketName,
  videoDistributionURI,
  thumbnailDistributionURI
} = config.sources.aws;

// Create S3 service object
const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
    region
  },
  useAccelerateEndpoint: true
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

export const doesVideoObjectExist = key => {
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
        message: 'doesVideoObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const doesThumbnailObjectExist = key => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`
      };
      const s3Object = await s3Client.send(new HeadObjectCommand(params));
      resolve(s3Object);
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'doesThumbnailObjectExist',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyVideoObject = (oldKey, newKey) => {
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
        message: 'copyVideoObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const copyThumbnailObject = (oldKey, newKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        CopySource: `${s3ThumbnailBucketName}/${oldKey}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`,
        Key: `${newKey}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`
      };
      await s3Client.send(new CopyObjectCommand(params));
      resolve();
    } catch (err) {
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'copyThumbnailObject',
        requestId,
        cfId,
        extendedRequestId
      });
      reject(err);
    }
  });
};

export const getVideoDistributionURI = fileName => {
  return `${videoDistributionURI}/${fileName}.${DEFAULT_VIDEO_FILE_EXTENTION}`;
};

export const getThumbnailDistributionURI = fileName => {
  return `${thumbnailDistributionURI}/${fileName}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`;
};

export const deleteVideoByKey = key => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: `${key}.${DEFAULT_VIDEO_FILE_EXTENTION}`
      };
      s3Client.send(new DeleteObjectCommand(params));
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
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket: s3ThumbnailBucketName,
        Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`
      };
      s3Client.send(new DeleteObjectCommand(params));
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

export const uploadVideoToS3 = (videoPath, key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: s3VideoBucketName,
        Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`, // File name you want to save as in S3
        Body: fs.createReadStream(videoPath)
      };

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
      console.log(err);
      const { requestId, cfId, extendedRequestId } = err.$metadata;
      console.log({
        message: 'uploadVideoToS3',
        requestId,
        cfId,
        extendedRequestId
      });
      console.log(
        `Error uploading video file to s3 bucket: ${s3VideoBucketName} `,
        err
      );
      reject(err);
    }
  });
};

export const uploadThumbnailToS3 = (fileContent, key) => {
  return new Promise(async (resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
      Bucket: s3ThumbnailBucketName,
      Key: `${key}.${DEFAULT_THUMBNAIL_FILE_EXTENTION}`, // File name you want to save as in S3
      Body: fileContent
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
        `Error uploading thumbnail file to s3 bucket: ${s3VideoBucketName} `,
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
      const duration = await getVideoDurationInSeconds(videoPath);
      const thumbnailFile = await getThumbnailContentFromPath(thumbnailPath);
      await uploadVideoToS3(videoPath, key);
      await uploadThumbnailToS3(thumbnailFile, key);
      const videoLocation = getVideoDistributionURI(key);
      const thumbNailLocation = getThumbnailDistributionURI(key);
      resolve({ thumbNailLocation, videoLocation, duration });
    } catch (err) {
      console.log(`Error uploading archives to s3 buckets`, err);
      reject(err);
    }
  });
};
