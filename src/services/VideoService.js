'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  createS3Bucket,
  doesS3ObjectExist,
  deleteVideoByKey
} from '../aws';
import models from '../models';
import {
  saveVideoRefToDB,
  updateVideoViews,
  seeIfVideoExist
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

const { Video } = models;
const queryOps = { __v: 0, _id: 0 };

const form = formidable({ multiples: true });

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

exports.getFileFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (!isEmpty(files)) {
        const { filepath } = files['file'];
        const { title, author } = fields;
        resolve({ filepath, title, title: name, author });
      } else {
        reject('File not present in form data');
      }
    });
  });
};

exports.getPayloadFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (!isEmpty(files)) {
        const { originalFilename: name, filepath } = files['file'];
        const { title, author } = fields;
        resolve({ name, filepath, title, author });
      } else {
        const { title: name, title, author } = fields;
        resolve({ name, title, author });
      }
    });
  });
};

exports.uploadVideo = async video => {
  try {
    const { name, author } = video;
    const doesVideoExist = await seeIfVideoExist(name);
    if (!doesVideoExist) {
      const isBucketAvaiable = await doesS3BucketExist();
      if (isBucketAvaiable) {
        const s3Location = await uploadArchiveToS3Location(video);
        const body = {
          videoName: name,
          author,
          url: s3Location,
          totalViews: 0
        };
        await saveVideoRefToDB(body);
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
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(video);
          const body = {
            videoName: name,
            author,
            url: s3Location,
            totalViews: 0
          };
          await saveVideoRefToDB(body);
          return {
            statusCode: 200,
            message: 'Video uploaded to s3 with success',
            broadcast: {
              videoName: name,
              url: s3Location
            }
          };
        } else {
          return badRequest('Unable to create s3 bucket.');
        }
      }
    } else {
      return badRequest('Video with the name provide already exists.');
    }
  } catch (err) {
    console.log(`Error uploading video to s3: `, err);
    return badImplementationRequest('Error uploading video to s3.');
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

exports.updateViews = async videoName => {
  try {
    const videoViews = await updateVideoViews(videoName);
    if (videoViews) {
      return {
        statusCode: 200,
        message: `${videoName} has ${videoViews} views.`,
        views: videoViews
      };
    }
    return badRequest(`No videos found with name: '${videoName}'`);
  } catch (err) {
    console.log('Error updating views on video: ', err);
    return badImplementationRequest('Error updating views.');
  }
};

exports.updateVideo = async video => {
  try {
    const { name, author } = video;
    const doesVideoExist = await seeIfVideoExist(name);
    if (!doesVideoExist) {
      const isBucketAvaiable = await doesS3BucketExist();
      if (isBucketAvaiable) {
        const s3Object = await doesS3ObjectExist(name);
        if (s3Object) {
          await deleteVideoByKey(name);
        }
        const s3Location = await uploadArchiveToS3Location(video);
        const body = {
          videoName: name,
          author,
          url: s3Location,
          totalViews: 0
        };
        await saveVideoRefToDB(body);
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
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(video);
          const body = {
            videoName: name,
            author,
            url: s3Location,
            totalViews: 0
          };
          await saveVideoRefToDB(body);
          return {
            statusCode: 200,
            message: 'Video uploaded to s3 with success',
            broadcast: {
              videoName: name,
              url: s3Location
            }
          };
        } else {
          return badRequest('Unable to create s3 bucket.');
        }
      }
    } else {
      return badRequest('Video with the name provide already exists.');
    }
  } catch (err) {
    console.log(`Error uploading video to s3: `, err);
    return badImplementationRequest('Error uploading video to s3.');
  }
};
