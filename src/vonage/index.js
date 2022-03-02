import OpenTok from 'opentok';
import config from '../config';

const { apiKey, apiSecret } = config.sources.vonage;
const opentok = new OpenTok(apiKey, apiSecret);

export const createSession = () => {
  return new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: 'routed' }, function (error, session) {
      if (error) {
        reject(error);
      }
      resolve(session);
    });
  });
};

export const generateToken = sessionId => {
  return opentok.generateToken(sessionId);
};
