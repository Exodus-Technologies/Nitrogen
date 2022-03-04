'use strict';

import formidable from 'formidable';
import config from '../config';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  createS3Bucket
} from '../aws';
import { saveVideoToDB } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

const { aws } = config.sources;
const { s3BucketName } = aws;

exports.getFileFromRequest = async req => {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, _, files) => {
      if (err) {
        reject(err);
      }
      const { originalFilename: name, filepath } = files[''];
      resolve({ name, filepath });
    });
  });
};

exports.uploadVideo = async video => {
  try {
    const { name } = video;
    const isBucketAvaiable = await doesS3BucketExist();
    if (isBucketAvaiable) {
      const s3Location = await uploadArchiveToS3Location(video);
      const body = {
        videoName: name,
        url: s3Location,
        totalViews: 0
      };
      await saveVideoToDB(body);
      return {
        statusCode: 200,
        message: 'Video uploaded to s3 with success',
        broadcast: {
          videoName: name,
          url: s3Location
        }
      };
    } else {
      await createS3Bucket();
      const s3Location = await uploadArchiveToS3Location(video);
      const body = {
        videoName: name,
        url: s3Location,
        totalViews: 0
      };
      await saveVideoToDB(body);
      return {
        statusCode: 200,
        message: 'Video uploaded to s3 with success',
        broadcast: {
          videoName: name,
          url: s3Location
        }
      };
    }
  } catch (err) {
    console.log(`Error uploading video to s3: `, err);
    return badImplementationRequest('Error uploading video to s3');
  }
};
