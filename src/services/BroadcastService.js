'use strict';

import { getActiveBroadcast, deleteBroadcast } from '../mongodb';
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

exports.deleteBroadcast = async broadcastId => {
  try {
    const deletedBroadcast = await deleteBroadcast(broadcastId);
    if (deletedBroadcast) {
      return [204];
    } else {
      return badRequest(`No broadcast to delete by ID provided.`);
    }
  } catch (err) {
    console.log('Error deleting broadcast: ', err);
    return badImplementationRequest('Error deleting broadcast.');
  }
};
