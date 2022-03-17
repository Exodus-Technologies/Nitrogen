'use strict';

import { getActiveBroadcast } from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getActiveBroadcast = async () => {
  try {
    const broadcast = await getActiveBroadcast();
    if (broadcast) {
      return {
        statusCode: 200,
        broadcast
      };
    } else {
      return badRequest(`No active broadcast avaiable.`);
    }
  } catch (err) {
    console.log('Error getting active broadcast: ', err);
    return badImplementationRequest('Error getting active broadcast.');
  }
};
