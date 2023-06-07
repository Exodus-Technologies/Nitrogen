'use strict';

import { getActiveBroadcast, deleteBroadcast, getBroadcasts } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getActiveBroadcast = async () => {
  try {
    const broadcast = await getActiveBroadcast();
    if (broadcast) {
      return [200, broadcast];
    } else {
      return badRequest(`No active broadcast avaiable.`);
    }
  } catch (err) {
    console.log('Error getting active broadcast: ', err);
    return badImplementationRequest('Error getting active broadcast.');
  }
};

exports.getBroadcasts = async query => {
  try {
    const broadcasts = await getBroadcasts(query);
    if (broadcasts) {
      return [
        200,
        { message: 'Broadcasts fetched from db with success', broadcasts }
      ];
    } else {
      return badRequest(`No broadcasts found with selected query params.`);
    }
  } catch (err) {
    console.log('Error getting all broadcasts: ', err);
    return badImplementationRequest('Error getting broadcasts.');
  }
};

exports.deleteBroadcast = async broadcastId => {
  try {
    const [error, deletedBroadcast] = await deleteBroadcast(broadcastId);
    if (deletedBroadcast) {
      return [204];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting broadcast: ', err);
    return badImplementationRequest('Error deleting broadcast.');
  }
};
