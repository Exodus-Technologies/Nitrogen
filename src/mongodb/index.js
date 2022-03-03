'use strict';

import models from '../models';

const { Session, Broadcast, Video } = models;

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

export const saveVideoToDB = async payload => {
  try {
    const video = new Video(payload);
    await video.save();
    if (video) {
      return video;
    }
  } catch (err) {
    console.log('Error saving video data to db: ', err);
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
