'use strict';

import config from '../config';
import { createSession, generateToken } from '../vonage';
import { saveSessionToDb } from '../mongodb';
import { badImplementationRequest, badRequest } from '../codes';

const { apiKey } = config.sources.vonage;

exports.createSession = async () => {
  try {
    const { sessionId } = await createSession();
    const session = await saveSessionToDb({ apiKey, sessionId });
    if (session) {
      const token = generateToken(sessionId);
      return {
        statusCode: 201,
        message: 'Session created with success',
        session: {
          sessionId,
          apiKey,
          token
        }
      };
    }
    return badRequest('Unable to create session.');
  } catch (err) {
    console.log(`Error creating session: `, err);
    return badImplementationRequest('Error creating session.');
  }
};
