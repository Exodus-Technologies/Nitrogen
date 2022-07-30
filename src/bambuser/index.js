'use strict';

const axios = require('axios').default;

import config from '../config';

const { bambuser } = config.sources;
const { apiKey } = bambuser;

const axoisInstance = axios.create({
  baseURL: 'https://api.bambuser.com/broadcasts',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.bambuser.v1+json',
    'Authorization': `Bearer ${apiKey}`
  }
});

export const getBroadCastById = async broadcastId => {
  try {
    const response = await axoisInstance({
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
    const response = await axoisInstance({
      url: `/${broadcastId}/downloads`,
      method: 'GET'
    });

    const { data: link } = response;

    return link;
  } catch (err) {
    console.log('Error getting broadcast download link from bambuser: ', err);
  }
};

export const getDownloadLink = async broadcastId => {
  try {
    const response = await axoisInstance({
      url: `/${broadcastId}/downloads`,
      method: 'GET'
    });

    const { data: link } = response;

    return link;
  } catch (err) {
    console.log('Error getting broadcast download link from bambuser: ', err);
  }
};
