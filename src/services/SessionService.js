'use strict';

import models from '../models';
import { createSession, generateToken } from '../vonage';
import { badImplementationRequest, badRequest } from '../codes';
import config from '../config';

const { apiKey } = config.sources.vonage;
const { Session } = models;

exports.createSession = async () => {
  try {
    const { sessionId } = await createSession();
    const session = new Session({ apiKey, sessionId });
    await session.save();
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
