'use strict';

import moment from 'moment';
import config from '../config';
import {
  uploadVideoToS3,
  uploadThumbnailToS3,
  getVideoURLFromS3,
  getThumbnailURLFromS3
} from '../aws';
import { createVideo } from '../mongodb';
import AxiosClient from '../utilities/client';
import {
  fancyTimeFormat,
  getContentFromURL,
  getVideoContentFromURL
} from '../utilities';
import { DOWNLOAD_LINK_SUCCESS_STATUS, VIDEO_DRAFT_STATUS } from '../constants';

const { bambuser } = config.sources;
const { apiKey, broadcastURL } = bambuser;

const axiosClient = new AxiosClient(broadcastURL, apiKey);

export const getBroadCastById = async broadcastId => {
  try {
    const v1Instance = axiosClient.getV1();
    const response = await v1Instance({
      url: `/${broadcastId}`,
      method: 'GET'
    });

    const { data: broadcast } = response;

    return broadcast;
  } catch (err) {
    console.log('Error getting broadcast data from bambuser: ', err);
  }
};

export const deleteBroadCastById = async broadcastId => {
  try {
    const v1Instance = axiosClient.getV1();
    await v1Instance({
      url: `/${broadcastId}`,
      method: 'DELETE'
    });

    console.log('Broadcast deleted from bambuser');
  } catch (err) {
    console.log('Error getting broadcast download link from bambuser: ', err);
  }
};

export const getDownloadLink = broadcastId => {
  return new Promise(async (resolve, reject) => {
    try {
      const v2Instance = axiosClient.getV2();
      const response = await v2Instance({
        url: `/${broadcastId}/downloads`,
        method: 'POST',
        data: JSON.stringify({ format: 'mp4-h264' })
      });

      const { data: link } = response;

      console.log('status of mp4 conversion: ', link.progress);

      if (link.status !== DOWNLOAD_LINK_SUCCESS_STATUS) {
        setTimeout(() => {
          getDownloadLink(broadcastId);
        }, 10000);
      }

      if (link.status === DOWNLOAD_LINK_SUCCESS_STATUS) {
        console.log('Sending link to be processed to s3');
        resolve(link);
      }
    } catch (err) {
      console.log('Error getting broadcast download link from bambuser: ', err);
      reject(err);
    }
  });
};

export const uploadLivestream = async broadcastId => {
  try {
    const broadcast = await getBroadCastById(broadcastId);
    const link = await getDownloadLink(broadcastId);
    const { preview, title } = broadcast;
    const { url } = link;
    const { file: videoFile, duration: videoDuration } =
      await getVideoContentFromURL(url);
    const { file: thumbnailFile } = await getContentFromURL(preview);
    const currentDate = moment(new Date()).format('MM-DD-YYYY');
    const key = `livestream-${currentDate}`;

    console.log('uploading video to s3....');
    await uploadVideoToS3(videoFile, key);

    console.log('uploading thumbnail to s3....');
    await uploadThumbnailToS3(thumbnailFile, key);

    const videoLocation = getVideoURLFromS3(key);
    const thumbNailLocation = getThumbnailURLFromS3(key);

    const body = {
      title: title || key,
      description: `Livestream that was created on ${currentDate}`,
      key,
      broadcastId,
      categories: ['Livestream'],
      duration: fancyTimeFormat(videoDuration),
      url: videoLocation,
      thumbnail: thumbNailLocation,
      status: VIDEO_DRAFT_STATUS
    };

    const video = await createVideo(body);
    if (video) {
      return [null, video];
    } else {
      return [Error('Unable to save video metadata.')];
    }
  } catch (err) {
    console.log(`Error with moving livestream data to s3: `, err);
    return [Error(`Unable to save video metadata: ${err.response.statusText}`)];
  }
};
