'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';
import {
  saveBroadcastToDb,
  updateBroadcastInDB,
  getBroadcastById
} from '../mongodb';

const { platfromKeys } = config.sources.bambuser;

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = platfromKeys[platform];
    if (applicationId) {
      return {
        statusCode: 200,
        message: 'Retrieved application id with success.',
        applicationId
      };
    }
    return badRequest(`No application ids found with platform: '${platform}.'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return badImplementationRequest('Error getting applicationId.');
  }
};

exports.webHookCallback = async payload => {
  try {
    const { eventId } = payload;
    const broadcast = await getBroadcastById(eventId);
    if (broadcast) {
      const updatedBroadcast = await updateBroadcastInDB(payload);
      return {
        statusCode: 200,
        message: 'Broadcast metadata was updated success.',
        broadcast: {
          ...updatedBroadcast
        }
      };
    } else {
      const savedBroadcast = await saveBroadcastToDb(payload);
      if (savedBroadcast) {
        return {
          statusCode: 200,
          message: 'Broadcast metadata was saved success.',
          broadcast: {
            ...savedBroadcast
          }
        };
      } else {
        return badRequest(
          `Unable to save broadcast data from the bambuser webhook.`
        );
      }
    }
  } catch (error) {
    console.log(`Error executing webhook callback: `, err);
    return badImplementationRequest('Error executing webhook callback.');
  }
};
