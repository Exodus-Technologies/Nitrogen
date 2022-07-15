'use strict';

import formidable from 'formidable';
import {
  uploadArchiveToS3Location,
  doesVideoS3BucketExist,
  doesThumbnailS3BucketExist,
  doesS3ObjectExist,
  deleteVideoByKey,
  copyS3Object,
  getObjectUrlFromS3,
  deleteThumbnailByKey,
  createVideoS3Bucket,
  createThumbnailS3Bucket
} from '../aws';
import {
  VIDEO_MIME_TYPE,
  THUMBNAIL_MIME_TYPE,
  MAX_FILE_SIZE
} from '../constants';
import {
  saveVideoRefToDB,
  updateVideoViews,
  getVideoById,
  getVideoByTitle,
  updateVideo,
  deleteVideoById,
  getVideos,
  getTotal
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';
import { fancyTimeFormat } from '../utilities';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}

exports.getPayloadFromRequest = async req => {
  const form = formidable({
    multiples: true,
    maxFileSize: MAX_FILE_SIZE
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (isEmpty(fields)) reject('Form is empty.');
      const file = { ...fields, key: removeSpaces(fields.title) };
      if (!isEmpty(files)) {
        const { filepath: videoPath, mimetype: videoType } = files['file'];
        const { filepath: thumbnailPath, mimetype: thumbnailType } =
          files['thumbnail'];
        resolve({
          ...file,
          videoPath,
          videoType,
          thumbnailPath,
          thumbnailType
        });
      } else {
        resolve(file);
      }
    });
    form.on('error', err => {
      console.log('Error on form parse: ', err);
    });
    form.on('end', () => {
      console.log('Form is finished processing.');
    });
  });
};

exports.uploadVideo = async archive => {
  try {
    const {
      title,
      description,
      videoPath,
      videoType,
      thumbnailPath,
      thumbnailType,
      key,
      categories,
      avaiableForSale
    } = archive;
    if (!title) {
      return badRequest('Must have file title associated with file upload.');
    }
    if (!description) {
      return badRequest(
        'Must have file description associated with file upload.'
      );
    }
    if (description && description.length > 255) {
      return badRequest(
        'Description must be provided and less than 255 characters long.'
      );
    }
    if (!videoPath) {
      return badRequest('File must be provided to upload.');
    }
    if (videoPath && videoType !== VIDEO_MIME_TYPE) {
      return badRequest('File must be a file with a mp4 extention.');
    }

    if (!thumbnailPath) {
      return badRequest('Thumbnail must be provided to upload.');
    }
    if (thumbnailPath && thumbnailType !== THUMBNAIL_MIME_TYPE) {
      return badRequest(
        'Thumbnail must be a file with a image type extention.'
      );
    }
    const video = await getVideoByTitle(title);
    if (video) {
      return badRequest(
        `Video with the title ${title} provide already exists.`
      );
    } else {
      const isVideoBucketAvaiable = await doesVideoS3BucketExist();
      const isThumbnailBucketAvaiable = await doesThumbnailS3BucketExist();
      if (!isVideoBucketAvaiable && !isThumbnailBucketAvaiable) {
        await createVideoS3Bucket();
        await createThumbnailS3Bucket();
      } else {
        const { thumbNailLocation, videoLocation, duration } =
          await uploadArchiveToS3Location(archive);
        const body = {
          title,
          description,
          key,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          avaiableForSale,
          duration: fancyTimeFormat(duration),
          url: videoLocation,
          thumbnail: thumbNailLocation
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
    const {
      title,
      description,
      filepath,
      categories,
      videoId,
      mimetype,
      avaiableForSale
    } = archive;
    if (!videoId) {
      return badRequest('Video id must be provided.');
    }
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
          key: newKey,
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          url: s3Location,
          avaiableForSale
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
              url: s3Location,
              avaiableForSale
            }
          }
        ];
      }
      if (filepath) {
        if (mimetype !== DEFAULT_MIME_TYPE) {
          return badRequest('File must be a file with a mp4 extention.');
        }
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
            duration: fancyTimeFormat(duration),
            ...(categories && {
              categories: categories.split(',').map(item => item.trim())
            }),
            url: location,
            avaiableForSale
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
                url: location,
                avaiableForSale
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
          ...(categories && {
            categories: categories.split(',').map(item => item.trim())
          }),
          url,
          avaiableForSale
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
              url,
              avaiableForSale
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
      await deleteThumbnailByKey(key);
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

exports.getTotal = async query => {
  try {
    const videos = await getTotal(query);
    if (videos) {
      return [
        200,
        {
          message: 'Successful fetch for get total video with query params.',
          total_issue: videos
        }
      ];
    }
    return badRequest(`No video found with selected query params.`);
  } catch (err) {
    console.log('Error getting all videos: ', err);
    return badImplementationRequest('Error getting videos.');
  }
};
