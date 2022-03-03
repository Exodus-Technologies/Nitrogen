'use strict';

import formidable from 'formidable';
import {
  doesS3BucketExist,
  uploadArchiveToS3Location,
  createS3Bucket
} from '../aws';
import { saveVideoToDB } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

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
    console.log(isBucketAvaiable);
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
