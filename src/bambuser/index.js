'use strict';

import moment from 'moment';
const axios = require('axios').default;
import config from '../config';
import {
  getObjectUrlFromS3,
  uploadVideoToS3,
  uploadThumbnailToS3
} from '../aws';
import { badImplementationRequest, badRequest } from '../response-codes';
import { createVideo } from '../mongodb';

import { getFileContentFromURL, fancyTimeFormat } from '../utilities';

const { bambuser } = config.sources;
const { apiKey } = bambuser;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`
};

const baseURL = 'https://api.bambuser.com/broadcasts';

const axoisV1Instance = axios.create({
  baseURL,
  headers: {
    ...headers,
    Accept: 'application/vnd.bambuser.v1+json'
  }
});

const axoisV2Instance = axios.create({
  baseURL,
  headers: {
    ...headers,
    Accept: 'application/vnd.bambuser.v2+json'
  }
});

export const getBroadCastById = async broadcastId => {
  try {
    const response = await axoisV1Instance({
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
    const response = await axoisV1Instance({
      url: `/${broadcastId}`,
      method: 'DELETE'
    });

    const { data: link } = response;

    return link;
  } catch (err) {
    console.log('Error getting broadcast download link from bambuser: ', err);
  }
};

export const getDownloadLink = async broadcastId => {
  try {
    const response = await axoisV2Instance({
      url: `/${broadcastId}/downloads`,
      method: 'POST',
      data: JSON.stringify({ format: 'mp4-h264' })
    });

    const { data: link } = response;

    return link;
  } catch (err) {
    console.log('Error getting broadcast download link from bambuser: ', err);
  }
};

export const uploadLivestream = async broadcastId => {
  try {
    const broadcast = await getBroadCastById(broadcastId);
    const link = await getDownloadLink(broadcastId);
    const { preview, title } = broadcast;
    const { url } = link;
    const { file: videoFile, duration: videoDuration } =
      await getFileContentFromURL(url);
    const { file: thumbnailFile } = await getFileContentFromURL(preview, false);
    const currentDate = moment(new Date()).format('MM-DD-YYYY');
    const key = title ? `${title}-${currentDate}` : `livestream-${currentDate}`;

    await uploadVideoToS3(videoFile, key);
    await uploadThumbnailToS3(thumbnailFile, key);
    const videoLocation = getObjectUrlFromS3(key);
    const thumbNailLocation = getObjectUrlFromS3(key, false);

    const body = {
      title,
      description: `Livestream that was created on ${currentDate}`,
      key,
      categories: ['Livestream'],
      duration: fancyTimeFormat(videoDuration),
      url: videoLocation,
      thumbnail: thumbNailLocation
    };

    const video = await createVideo(body);
    if (video) {
      return [null, video];
    } else {
      return [Error('Unable to save video metadata.')];
    }
  } catch (err) {
    console.log(`Error with moving livestream data to s3: `, err);
    return badImplementationRequest('Error with moving livestream data to s3.');
  }
};
