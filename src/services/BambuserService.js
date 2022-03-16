'use strict';

import config from '../config';
import { badImplementationRequest, badRequest } from '../response-codes';

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
    return badRequest(`No application ids found with platform: '${platform}'`);
  } catch (err) {
    console.log('Error getting applicationId: ', err);
    return badImplementationRequest('Error getting applicationId.');
  }
};
