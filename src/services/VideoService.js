'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  createS3Bucket
} from '../aws';
import models from '../models';
import { saveVideoToDB, updateVideoClicks } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

const { Video } = models;
const queryOps = { __v: 0, _id: 0 };

exports.getFileFromRequest = async req => {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const { originalFilename: name, filepath } = files['file'];
      const { title, author } = fields;
      resolve({ name, filepath, title, author });
    });
  });
};

exports.uploadVideo = async video => {
  try {
    const { name, title, author } = video;
    const isBucketAvaiable = await doesS3BucketExist();
    if (isBucketAvaiable) {
      const s3Location = await uploadArchiveToS3Location(video);
      const body = {
        videoName: title,
        author,
        url: s3Location,
        totalViews: 0
      };
      await saveVideoToDB(body);
      return {
        statusCode: 200,
        message: 'Video uploaded to s3 with success',
        broadcast: {
          videoName: title,
          url: s3Location
        }
      };
    } else {
      await createS3Bucket();
      const s3Location = await uploadArchiveToS3Location(video);
      const body = {
        videoName: title,
        author,
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

exports.getVideos = async query => {
  try {
    const videos = await Video.find(query, queryOps);
    if (videos.length) {
      return {
        statusCode: 200,
        items: videos
      };
    } else {
      return badRequest(`No videos found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all videos: ', err);
    return badImplementationRequest('Error getting videos.');
  }
};

exports.updateClicks = async videoName => {
  try {
    const videoClicks = await updateVideoClicks(videoName);
    return {
      statusCode: 200,
      message: `${videoName} has ${videoClicks} clicks`
    };
  } catch (err) {
    console.log('Error updating clicks on video: ', err);
    return badImplementationRequest('Error Error updating clicks.');
  }
};
