'use strict';

import { badImplementationRequest } from '../response-codes';

exports.startBroadcast = async () => {
  try {
  } catch (err) {
    console.log(`Error starting broadcast: `, err);
    return badImplementationRequest(
      'No clients are actively connected to the OpenTok session provided.'
    );
  }
};

exports.stopBroadcast = async () => {
  try {
  } catch (error) {
    console.log(`Error stopping broadcast: `, err);
    return badImplementationRequest('Error stopping broadcast');
  }
};

exports.archiveCallback = async () => {
  try {
  } catch (error) {
    console.log(`Error executing archive callback: `, err);
    return badImplementationRequest('Error executing archive callback.');
  }
};
