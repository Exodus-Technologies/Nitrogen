'use strict';

import { startBroadcast, stopBroadcast } from '../vonage';
import {
  getActiveSession,
  saveBroadcastToDb,
  updateBroadcastInDB,
  updateSessionInDB
} from '../mongodb';
import {
  doesS3BucketExist,
  uploadArchiveToS3Location,
  createS3Bucket,
  getObjectUrlFromS3
} from '../aws';
import { badImplementationRequest, badRequest } from '../response-codes';

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
        return badRequest('Unable to start broadcast.');
      }
    } else {
      return badRequest('No active sessions running.');
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
    const { broadcastId } = await getActiveBroadcast();
    const stoppedBroadcast = await stopBroadcast(broadcastId);
    if (stoppedBroadcast) {
      const { sessionId } = stoppedBroadcast;
      await updateBroadcastInDB(broadcastId);
      await updateSessionInDB(sessionId);
      return {
        statusCode: 200,
        message: 'Broadcast was stopped successfully.'
      };
    } else {
      return badRequest('Unable to stop broadcast!');
    }
  } catch (error) {
    console.log(`Error stopping broadcast: `, err);
    return badImplementationRequest('Error stopping broadcast');
  }
};

exports.archiveCallback = async archive => {
  try {
    const { id: archiveId, name, partnerId: apiKey, sessionId } = archive;
    const doesBucketExist = await doesS3BucketExist();
    if (doesBucketExist) {
      const s3Url = getObjectUrlFromS3(name);
      const body = {
        archiveId,
        videoName: name,
        apiKey,
        sessionId,
        url: s3Url
      };
      await saveVideoRefToDB(body);
      return {
        statusCode: 200,
        message: 'Archive was transferred with success.',
        archive: {
          archiveId,
          videoName: name,
          apiKey,
          sessionId,
          url: s3Url
        }
      };
    } else {
      await createS3Bucket();
      const s3Location = await uploadArchiveToS3Location(archive);
      const body = {
        archiveId,
        videoName: name,
        apiKey,
        sessionId,
        url: s3Location
      };
      await saveVideoRefToDB(body);
      return {
        statusCode: 200,
        message: 'Broadcast was stopped with success',
        archive: {
          archiveId,
          videoName: name,
          apiKey,
          sessionId,
          url: s3Location
        }
      };
    }
  } catch (error) {
    console.log(`Error executing archive callback: `, err);
    return badImplementationRequest('Error executing archive callback.');
  }
};
