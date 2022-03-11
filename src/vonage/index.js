import OpenTok from 'opentok';
import config from '../config';

const { apiKey, apiSecret } = config.sources.vonage;
const opentok = new OpenTok(apiKey, apiSecret);

export const createSession = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession(
      { mediaMode: 'routed', archiveMode: 'always' },
      function (error, session) {
        if (error) {
          reject(error);
        }
        resolve(session);
      }
    );
  });
};

export const generateToken = sessionId => {
  return opentok.generateToken(sessionId);
};

export const startBroadcast = (
  sessionId,
  broadcastOptions = {
    outputs: {
      hls: {}
    },
    maxDuration: 5400,
    resolution: '640x480'
  }
) => {
  return new Promise((resolve, reject) => {
    opentok.startBroadcast(
      sessionId,
      broadcastOptions,
      function (error, broadcast) {
        if (error) {
          reject(error);
        }
        resolve(broadcast);
      }
    );
  });
};

export const stopBroadcast = broadcastId => {
  return new Promise((resolve, reject) => {
    opentok.stopBroadcast(broadcastId, function (error, broadcast) {
      if (error) {
        reject(error);
      }
      resolve(broadcast);
    });
  });
};
