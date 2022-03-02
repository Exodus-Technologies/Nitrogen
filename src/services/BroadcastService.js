'use strict';

import {
  startBroadcast,
  startArchive,
  stopBroadcast,
  stopArchive,
  getArchiveById
} from '../vonage';
import {
  getActiveSession,
  saveBroadcastToDb,
  updateBroadcastInDB,
  updateSessionInDB
} from '../mongodb';
import {
  doesS3BucketExist,
  uploadArchiveToS3Location,
  createS3Bucket
} from '../aws';
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
              broadcastId,
              archiveId
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
    return badImplementationRequest(
      'No clients are actively connected to the OpenTok session provided.'
    );
  }
};

exports.stopBroadcast = async () => {
  try {
    const { broadcastId, archiveId } = await getActiveBroadcast();
    const stoppedBroadcast = await stopBroadcast(broadcastId);
    if (stoppedBroadcast) {
      const { sessionId } = stoppedBroadcast;
      await updateBroadcastInDB(broadcastId);
      await updateSessionInDB(sessionId);
      await stopArchive(archiveId);
      const archive = await getArchiveById(archiveId);
      if (archive) {
        const { name } = archive;
        const isBucketAvaiable = await doesS3BucketExist();
        if (isBucketAvaiable) {
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            broadcastId,
            archiveId,
            videoName: name,
            sessionId,
            url: s3Location,
            totalViews: 0
          };
          await saveVideoToDB(body);
          return {
            statusCode: 200,
            message: 'Broadcast was stopped with success',
            broadcast: {
              broadcastId,
              archiveId,
              sessionId,
              videoName: name,
              url: s3Location
            }
          };
        } else {
          await createS3Bucket();
          const s3Location = await uploadArchiveToS3Location(archive);
          const body = {
            broadcastId,
            archiveId,
            videoName: name,
            sessionId,
            url: s3Location,
            totalViews: 0
          };
          await saveVideoToDB(body);
          return {
            statusCode: 200,
            message: 'Broadcast was stopped with success',
            broadcast: {
              broadcastId,
              archiveId,
              sessionId,
              videoName: name,
              url: s3Location
            }
          };
        }
      } else {
        return badRequest('Unable to retrieve archive!');
      }
    } else {
      return badRequest('Unable to stop broadcast!');
    }
  } catch (error) {
    console.log(`Error stopping broadcast: `, err);
    return badImplementationRequest('Error stopping broadcast');
  }
};
