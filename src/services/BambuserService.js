'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';
import {
  saveBroadcastToDb,
  updateBroadcastInDB,
  getActiveBroadcast,
  deleteBroadcast
} from '../mongodb';

import { deleteBroadCastById, uploadLivestream } from '../bambuser';

const { platfromKeys } = config.sources.bambuser;

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = platfromKeys[platform];
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
      } else {
        console.log(`Unable to save broadcast data from the bambuser webhook.`);
        return badRequest(
          `Unable to save broadcast data from the bambuser webhook.`
        );
      }
    }
    const { broadcastId } = broadcast;
    const updatedBroadcast = await updateBroadcastInDB(broadcastId, payload);
    if (updatedBroadcast) {
      return [200];
    } else if (payload.type === 'archived') {
      const [error, livestream] = await uploadLivestream(broadcastId);
      if (livestream) {
        await deleteBroadCastById(broadcastId);
        await deleteBroadcast(broadcastId);
        return [200];
      }
      console.log(
        'Error with migrating livetsream data to s3: ',
        error.message
      );
      return [200];
    }
  } catch (err) {
    console.log(`Error executing webhook callback: `, err);
    return badImplementationRequest('Error executing webhook callback.');
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
    return badImplementationRequest('Error with moving livestream data to s3.');
  }
};
