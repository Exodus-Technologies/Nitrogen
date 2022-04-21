'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesS3BucketExist,
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

function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}

function fancyTimeFormat(duration) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
}

exports.getPayloadFromRequest = async req => {
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const file = { ...fields, key: removeSpaces(fields.title) };
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
    const { title, author, description, filepath, key, categories } = archive;
    if (!filepath) {
      return badRequest('File must be provided to upload.');
    }
    const video = await getVideoByTitle(title);
    if (video) {
      return badRequest(
        `Video with the title ${title} provide already exists.`
      );
    } else {
      const isBucketAvaiable = await doesS3BucketExist();
      if (isBucketAvaiable) {
        const { location, duration } = await uploadArchiveToS3Location(archive);
        const body = {
          title,
          author,
          description,
          key,
          categories: categories.split(',').map(item => item.trim()),
          duration: fancyTimeFormat(duration),
          url: location
        };

        const savedVideo = await saveVideoRefToDB(body);
        if (savedVideo) {
          return [
            200,
            { message: 'Video uploaded to s3 with success', video: savedVideo }
          ];
        } else {
          return badRequest('Unable to save video metadata.');
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
      return [200, { message: 'Videos fetched from db with success', videos }];
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
      return [200, { message: 'Video fetched from db with success', video }];
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
    const video = await updateVideoViews(videoId);
    if (video) {
      const { totalViews, title } = video;
      return [
        200,
        {
          message: `Video with title '${title.trim()}' has ${totalViews} views.`,
          views: totalViews
        }
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
    const { title, author, description, filepath, categories, videoId } =
      archive;
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
    }
    if (!categories) {
      return badRequest('Video categories must be provided.');
    }
    const video = await getVideoById(videoId);
    if (video) {
      const newKey = removeSpaces(title);
      if (newKey !== video.key) {
        await copyS3Object(video.key, newKey);
        const s3Location = getObjectUrlFromS3(newKey);
        const body = {
          title,
          videoId,
          description,
          author,
          key: newKey,
          categories: categories.split(',').map(item => item.trim()),
          url: s3Location
        };
        await updateVideo(body);
        await deleteVideoByKey(video.key);
        return [
          200,
          {
            message: 'Video updated to s3 with success',
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
          const s3Object = await doesS3ObjectExist(newKey);
          if (s3Object) {
            await deleteVideoByKey(newKey);
          }
          const { location, duration } = await uploadArchiveToS3Location(
            archive
          );
          const body = {
            title,
            videoId,
            description,
            key: newKey,
            author,
            duration: fancyTimeFormat(duration),
            categories: categories.split(',').map(item => item.trim()),
            url: location
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
                url: location
              }
            }
          ];
        }
      } else {
        const url = await getObjectUrlFromS3(newKey);
        const body = {
          title,
          videoId,
          description,
          key: newKey,
          author,
          categories: categories.split(',').map(item => item.trim()),
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
      const { key } = video;
      await deleteVideoByKey(key);
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
