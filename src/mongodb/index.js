'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;
const { Session, Broadcast, Video } = models;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

export const getActiveSession = async () => {
  try {
    const session = await Session.findOne({ isActive: true });
    if (session) {
      return session;
    }
  } catch (err) {
    console.log('Error getting most latest active session: ', err);
  }
};

export const getActiveBroadcast = async () => {
  try {
    const broadcast = await Broadcast.findOne({ isActive: true });
    if (broadcast) {
      return broadcast;
    }
  } catch (err) {
    console.log('Error getting most latest active broadcast: ', err);
  }
};

export const saveSessionToDb = async payload => {
  try {
    const session = new Session(payload);
    await session.save();
    if (session) {
      return session;
    }
  } catch (err) {
    console.log('Error saving session data to db: ', err);
  }
};

export const saveBroadcastToDb = async payload => {
  try {
    const broadcast = new Broadcast(payload);
    await broadcast.save();
    if (broadcast) {
      return broadcast;
    }
  } catch (err) {
    console.log('Error saving broadcast data to db: ', err);
  }
};

export const saveVideoRefToDB = async payload => {
  try {
    const video = new Video(payload);
    await video.save();
  } catch (err) {
    console.log('Error saving video data to db: ', err);
  }
};

export const updateVideo = async videoName => {
  try {
    const filter = { videoName };
    const options = { upsert: true };
    const update = { ...payload };

    await Video.findOneAndUpdate(filter, update, options);
  } catch (err) {
    console.log('Error updating video data to db: ', err);
  }
};

export const updateVideoViews = async videoName => {
  try {
    const video = await Video.findOne({ videoName });
    if (video) {
      video.totalViews += 1;
      await video.save();
      return video.totalViews;
    }
  } catch (err) {
    console.log('Error updating video views: ', err);
  }
};

export const updateSessionInDB = async sessionId => {
  const filter = { sessionId };
  const options = { new: true };
  const update = { isActive: false };

  await Session.findOneAndUpdate(filter, update, options);
};

export const updateBroadcastInDB = async broadcastId => {
  const filter = { broadcastId };
  const options = { new: true };
  const update = { isActive: false };

  await Broadcast.findOneAndUpdate(filter, update, options);
};

export const seeIfVideoExist = async videoName => {
  const existingVideo = await Video.findOne({ videoName });
  return !!existingVideo;
};
