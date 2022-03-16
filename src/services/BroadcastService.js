'use strict';

import { badImplementationRequest } from '../response-codes';

exports.webHookCallback = async () => {
  try {
  } catch (error) {
    console.log(`Error executing webhook callback: `, err);
    return badImplementationRequest('Error executing webhook callback.');
  }
};
