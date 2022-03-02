'use strict';

import models from '../models';

const { Session, Broadcast } = models;

export const getActiveSession = async () => {
  try {
    const session = await Session.findOne({ isActive: true });
    if (session) {
      return session;
    }
  } catch (err) {
    console.log('Error getting most latest active broadcast: ', err);
  }
};

export const saveBroadcastToDb = async payload => {
  try {
    const broadcast = new Broadcast(payload);
    await broadcast.save();
  } catch (err) {
    console.log('Error saving broadcast data to db: ', err);
  }
};
