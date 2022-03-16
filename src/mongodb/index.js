'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

export const getActiveBroadcast = async () => {
  try {
    const { Broadcast } = models;
    const broadcast = await Broadcast.findOne({ isActive: true });
    if (broadcast) {
      return broadcast;
    }
  } catch (err) {
    console.log('Error getting most latest active broadcast: ', err);
  }
};

export const saveBroadcastToDb = async payload => {
  try {
    const { Broadcast } = models;
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
    const { Video } = models;
    const video = new Video(payload);
    const createdVideo = await video.save();
    return createdVideo;
  } catch (err) {
    console.log('Error saving video data to db: ', err);
  }
};

export const updateVideo = async payload => {
  try {
    const { Video } = models;
    const { videoId } = payload;
    const filter = { videoId };
    const options = { upsert: true };
    const update = { ...payload };

    await Video.findOneAndUpdate(filter, update, options);
  } catch (err) {
    console.log('Error updating video data to db: ', err);
  }
};

export const updateVideoViews = async videoId => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ videoId });
    if (video) {
      video.totalViews += 1;
      await video.save();
      return video.totalViews;
    }
  } catch (err) {
    console.log('Error updating video views: ', err);
  }
};

export const updateBroadcastInDB = async broadcastId => {
  try {
    const { Broadcast } = models;
    const filter = { broadcastId };
    const options = { new: true };
    const update = { isActive: false };
    await Broadcast.findOneAndUpdate(filter, update, options);
  } catch (err) {
    console.log('Error updating broadcast status: ', err);
  }
};

export const getVideoByTitle = async title => {
  const { Video } = models;
  const existingVideo = await Video.findOne({ title });
  return existingVideo;
};

export const getVideoById = async videoId => {
  const { Video } = models;
  const existingVideo = await Video.findOne({ videoId });
  return existingVideo;
};
