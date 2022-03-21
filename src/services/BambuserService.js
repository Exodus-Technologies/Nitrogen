'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';
import {
  saveBroadcastToDb,
  updateBroadcastInDB,
  getActiveBroadcast
} from '../mongodb';

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
    if (broadcast) {
      const { broadcastId } = broadcast;
      const updatedBroadcast = await updateBroadcastInDB(broadcastId, payload);
      if (updatedBroadcast) {
        const { broadcastId, isActive } = updatedBroadcast;
        return [
          200,
          {
            message: 'Broadcast metadata was updated success.',
            broadcast: {
              broadcastId,
              isActive
            }
          }
        ];
      } else {
        console.log(
          `Unable to update broadcast data from the bambuser webhook.`
        );
        return badRequest(
          `Unable to update broadcast data from the bambuser webhook.`
        );
      }
    } else {
      const savedBroadcast = await saveBroadcastToDb(payload);
      if (savedBroadcast) {
        const { broadcastId, isActive } = savedBroadcast;
        return [
          200,
          {
            message: 'Broadcast metadata was saved with success.',
            broadcast: {
              broadcastId,
              isActive
            }
          }
        ];
      } else {
        console.log(`Unable to save broadcast data from the bambuser webhook.`);
        return badRequest(
          `Unable to save broadcast data from the bambuser webhook.`
        );
      }
    }
  } catch (err) {
    console.log(`Error executing webhook callback: `, err);
    return badImplementationRequest('Error executing webhook callback.');
  }
};
