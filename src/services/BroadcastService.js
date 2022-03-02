'use strict';

import { startBroadcast, startArchive } from '../vonage';
import { getActiveSession, saveBroadcastToDb } from '../mongodb';
import { badImplementationRequest, badRequest } from '../codes';

exports.startBroadcast = async archiveOptions => {
  try {
    const { sessionId } = await getActiveSession();
    if (sessionId) {
      const { id: broadcastId } = await startBroadcast(sessionId);
      if (broadcast) {
        const archive = await startArchive(sessionId, archiveOptions);
        if (archive) {
          const { id: archiveId } = archive;
          await saveBroadcastToDb({
            sessionId,
            broadcastId,
            archiveId,
            archiveOptions
          });
          return {
            statusCode: 201,
            message: 'Broadcast created with success',
            broadcast: {
              sessionId,
              broadcastId
            }
          };
        } else {
          return badRequest('Unable to start archiving.');
        }
      } else {
        return badRequest('Unable to start broadcast');
      }
    } else {
      return badRequest('No active sessions running atm.');
    }
  } catch (err) {
    console.log(`Error starting broadcast: `, err);
    return badImplementationRequest('Error starting broadcast.');
  }
};

exports.stopBroadcast = async () => {
  try {
  } catch (err) {
    console.log(`Error stopping broadcast: `, err);
    return badImplementationRequest('Error stopping broadcast.');
  }
};
