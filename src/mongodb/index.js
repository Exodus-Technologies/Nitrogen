'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

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

export const getVideoByTitle = async title => {
  const { Video } = models;
  const video = await Video.findOne({ title });
  return video;
};

export const getVideoById = async videoId => {
  const { Video } = models;
  const video = await Video.findOne({ videoId });
  return video;
};

export const getVideos = async query => {
  const { Video } = models;
  const videos = await Video.find(query, queryOps);
  return videos;
};

export const updateBroadcastInDB = async (broadcastId, livestream) => {
  try {
    const { Broadcast } = models;
    const { collection, payload } = livestream;
    const { type } = payload;
    const filter = { broadcastId };
    const options = { new: true };
    const update = {
      ...livestream,
      ...(collection && { collectionType: collection }),
      ...(type === 'archived' && { isActive: false })
    };
    const broadcast = await Broadcast.findOneAndUpdate(filter, update, options);
    return broadcast;
  } catch (err) {
    console.log('Error updating broadcast status: ', err);
  }
};

export const getActiveBroadcast = async () => {
  try {
    const { Broadcast } = models;
    const broadcast = await Broadcast.findOne({ isActive: true });
    return broadcast;
  } catch (err) {
    console.log('Error getting most latest active broadcast: ', err);
  }
};

export const getBroadcastById = async eventId => {
  try {
    const { Broadcast } = models;
    const broadcast = await Broadcast.findOne({ eventId });
    return broadcast;
  } catch (err) {
    console.log('Error getting broadcast by id: ', err);
  }
};

export const saveBroadcastToDb = async payload => {
  try {
    const { Broadcast } = models;
    const { collection } = payload;
    const body = {
      ...payload,
      collectionType: collection
    };
    const broadcast = new Broadcast(body);
    await broadcast.save();
    return broadcast;
  } catch (err) {
    console.log('Error saving broadcast data to db: ', err);
  }
};

export const deleteVideoById = async videoId => {
  const { Video } = models;
  const deletedVideo = await Video.deleteOne({ videoId });
  return deletedVideo;
};
