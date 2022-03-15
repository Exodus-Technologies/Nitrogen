'use strict';

import { badImplementationRequest, badRequest } from '../response-codes';
import { getApplicationId } from '../mongodb';

exports.getApplicationId = async query => {
  try {
    const { platform } = query;
    const applicationId = await getApplicationId(platform);
    if (applicationId) {
      return {
        statusCode: 200,
        message: 'Retrieved application id with success.',
        applicationId
      };
    }
    return badRequest(`No application ids found with platform: '${platform}'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return badImplementationRequest('Error getting applicationId.');
  }
};
