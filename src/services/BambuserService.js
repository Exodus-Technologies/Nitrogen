'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';
import {
  saveBroadcastToDb,
  updateBroadcastInDB,
  getActiveBroadcast,
  deleteBroadcast
} from '../mongodb';
import { getMP4DownloadStatus } from '../bambuser';

import { deleteBroadCastById, uploadLivestream } from '../bambuser';

const { platformKeys } = config.sources.bambuser;

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = platformKeys[platform];
    if (applicationId) {
      return [
        200,
        {
          message: 'Retrieved application id with success.',
          applicationId
        }
      ];
    }
    return badRequest(`No application ids found with platform: '${platform}.'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return badImplementationRequest('Error getting applicationId.');
  }
};

exports.webHookCallback = async payload => {
  try {
    const broadcast = await getActiveBroadcast();
    if (!broadcast) {
      const savedBroadcast = await saveBroadcastToDb(payload);
      if (savedBroadcast) {
        return [200];
      }
    }
    const { broadcastId } = broadcast;
    const updatedBroadcast = await updateBroadcastInDB(broadcastId, payload);
    if (updatedBroadcast) {
      return [200];
    }
    return [200];
  } catch (err) {
    console.log(`Error executing webhook callback: `, err);
    return [200];
  }
};

exports.getMP4DownloadStatus = async broadcastId => {
  try {
    const status = await getMP4DownloadStatus(broadcastId);
    if (status) {
      return [
        200,
        {
          message: 'Livestream data was fetched successfully.',
          status
        }
      ];
    }
    return badRequest('Unable to get status of mp4 format download');
  } catch (err) {
    console.log(`Error with fetching livestream data: `, err);
    return badImplementationRequest('Error with fetching livestream data');
  }
};

exports.uploadLivestream = async broadcastId => {
  try {
    const [error, livestream] = await uploadLivestream(broadcastId);
    if (livestream) {
      await deleteBroadCastById(broadcastId);
      await deleteBroadcast(broadcastId);
      return [
        200,
        {
          message: 'Livestream data was uploaded to s3 with success',
          livestream
        }
      ];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log(`Error with moving livestream data to s3: `, err);
    return badImplementationRequest('Error with moving livestream data to s3');
  }
};
