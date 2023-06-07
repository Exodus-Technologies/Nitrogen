'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';
import {
  createBroadcast,
  updateBroadcast,
  getActiveBroadcast,
  deleteBroadcast
} from '../mongodb';
import { deleteBroadCastById, uploadLivestream } from '../bambuser';
import { BAMBUSER_BROADCAST_ARCHIVED_STATUS } from '../constants';

const { platforms } = config.sources.bambuser;

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = platforms[platform];
    if (applicationId) {
      return [
        200,
        {
          message: 'Retrieved application id with success.',
          applicationId
        }
      ];
    }
    return badRequest(`No application id found with platform: '${platform}.'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return badImplementationRequest('Error getting applicationId.');
  }
};

exports.webHookCallback = async payload => {
  try {
    const broadcast = await getActiveBroadcast();
    if (!broadcast) {
      const savedBroadcast = await createBroadcast(payload);
      if (savedBroadcast) {
        return [200];
      }
    }
    const { broadcastId } = broadcast;
    const updatedBroadcast = await updateBroadcast(broadcastId, payload);
    if (updatedBroadcast) {
      if (payload.type === BAMBUSER_BROADCAST_ARCHIVED_STATUS) {
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
      }
    }
    return [200];
  } catch (err) {
    console.log(`Error executing webhook callback: `, err);
    return [200];
  }
};
