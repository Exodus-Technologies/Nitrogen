'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
  createS3Bucket,
  doesS3ObjectExist,
  deleteVideoByKey,
  copyS3Object,
  getObjectUrlFromS3
} from '../aws';
import {
  saveVideoRefToDB,
  updateVideoViews,
  getVideoById,
  getVideoByTitle,
  updateVideo,
  deleteVideoById,
  getVideos
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

const form = formidable({ multiples: true });

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function doesValueHaveSpaces(str) {
  return /\s/.test(str);
}

exports.getPayloadFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const file = { ...fields };
      if (!isEmpty(files)) {
        const { filepath } = files['file'];
        resolve({ ...file, filepath });
      } else {
        resolve(file);
      }
    });
  });
};

exports.uploadVideo = async archive => {
  try {
    const { title, author, filepath, description } = archive;
    if (!filepath) {
      return badRequest('File must be provided to upload.');
    }
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of video must not have spaces.');
    }
    const video = await getVideoByTitle(title);
    if (video) {
      return badRequest(
        `Video with the title ${title} provide already exists.`
      );
    } else {
      const isBucketAvaiable = await doesS3BucketExist();
      if (isBucketAvaiable) {
        const s3Location = await uploadArchiveToS3Location(archive);
        const body = {
          title,
          author,
          description,
          url: s3Location
        };
        const savedVideo = await saveVideoRefToDB(body);
        return [
          200,
          { message: 'Video uploaded to s3 with success', video: savedVideo }
        ];
      } else {
        await createS3Bucket();
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            author,
            description,
            url: s3Location
          };
          const savedVideo = await saveVideoRefToDB(body);
          return [
            200,
            { message: 'Video uploaded to s3 with success', video: savedVideo }
          ];
        } else {
          return badRequest('Unable to create s3 bucket.');
        }
      }
    }
  } catch (err) {
    console.log(`Error uploading video to s3: `, err);
    return badImplementationRequest('Error uploading video to s3.');
  }
};

exports.getVideos = async query => {
  try {
    const videos = await getVideos(query);
    if (videos) {
      return [200, { items: videos }];
    } else {
      return badRequest(`No videos found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all videos: ', err);
    return badImplementationRequest('Error getting videos.');
  }
};

exports.getVideo = async videoId => {
  try {
    const video = await getVideoById(videoId);
    if (video) {
      return [200, { video }];
    } else {
      return badRequest(`No video found with id provided.`);
    }
  } catch (err) {
    console.log('Error getting video by id ', err);
    return badImplementationRequest('Error getting video by id.');
  }
};

exports.updateViews = async videoId => {
  try {
    const videoViews = await updateVideoViews(videoId);
    if (videoViews) {
      return [
        200,
        { message: `${videoId} has ${videoViews} views.`, views: videoViews }
      ];
    }
    return badRequest(`No videos found to update clicks.`);
  } catch (err) {
    console.log('Error updating views on video: ', err);
    return badImplementationRequest('Error updating views.');
  }
};

exports.updateVideo = async archive => {
  try {
    const { title, filepath, videoId, description, author } = archive;
    if (doesValueHaveSpaces(title)) {
      return badRequest('Title of video must not have spaces.');
    }
    const video = await getVideoById(videoId);
    if (video) {
      if (title !== video.title) {
        await copyS3Object(video.title, title);
        const s3Location = getObjectUrlFromS3(title);
        const body = {
          title,
          videoId,
          description,
          author,
          url: s3Location
        };
        await updateVideo(body);
        await deleteVideoByKey(video.title);
        return [
          200,
          {
            message: 'Video uploaded to s3 with success',
            video: {
              title,
              videoId,
              description,
              author,
              url: s3Location
            }
          }
        ];
      }
      if (filepath) {
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Object = await doesS3ObjectExist(title);
          if (s3Object) {
            await deleteVideoByKey(title);
          }
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            title,
            videoId,
            description,
            author,
            url: s3Location
          };
          await updateVideo(body);
          return [
            200,
            {
              message: 'Video uploaded to s3 with success',
              video: {
                title,
                videoId,
                description,
                author,
                url: s3Location
              }
            }
          ];
        }
      } else {
        const url = await getObjectUrlFromS3(title);
        const body = {
          title,
          videoId,
          description,
          author,
          url
        };
        await updateVideo(body);
        return [
          200,
          {
            message: 'Video updated with success.',
            video: {
              title,
              videoId,
              description,
              author,
              url
            }
          }
        ];
      }
    } else {
      return badRequest(`No videoId was passed to update video.`);
    }
  } catch (err) {
    console.log(`Error updating video metadata: `, err);
    return badImplementationRequest('Error updating video metadata.');
  }
};

exports.deleteVideoById = async videoId => {
  try {
    const video = await getVideoById(videoId);
    if (video) {
      const { title } = video;
      await deleteVideoByKey(title);
      const deletedVideo = await deleteVideoById(videoId);
      if (deletedVideo) {
        return [204];
      }
    }
    return badRequest(`No video found with id provided.`);
  } catch (err) {
    console.log('Error deleting video by id: ', err);
    return badImplementationRequest('Error deleting video by id.');
  }
};
