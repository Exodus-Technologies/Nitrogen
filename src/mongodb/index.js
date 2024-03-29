'use strict';

import config from '../config';
import models from '../models';

const { dbUser, dbPass, clusterDomain, dbName } = config.sources.mongodb;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterDomain}/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getVideos = async query => {
  try {
    const { Video } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;

    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (key != 'page' && key != 'limit' && key != 'sort') {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
      }
    }
    let objectFilter = {};
    if (filter.length > 0) {
      objectFilter = {
        $and: filter
      };
    }

    let sortString = '-id';
    if (query.sort) {
      sortString = query.sort;
    }

    const videos = await Video.find(objectFilter, queryOps)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();
    const total = await Video.find(objectFilter, queryOps).count();
    return videos.map(video => {
      return {
        ...video,
        total,
        pages: Math.ceil(total / limit)
      };
    });
  } catch (err) {
    console.log('Error getting video data from db: ', err);
  }
};

export const getBroadcasts = async query => {
  try {
    const { Broadcast } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;

    const filter = [];
    for (const [key, value] of Object.entries(query)) {
      if (key != 'page' && key != 'limit' && key != 'sort') {
        filter.push({ [key]: { $regex: value, $options: 'i' } });
      }
    }

    const objectFilter = { isActive: false };
    if (filter.length > 0) {
      objectFilter['$and'] = filter;
    }

    let sortString = '-id';
    if (query.sort) {
      sortString = query.sort;
    }

    const broadcasts = await Broadcast.find(objectFilter, queryOps)
      .limit(limit)
      .skip(skipIndex)
      .sort(sortString)
      .lean()
      .exec();

    const total = await Broadcast.find(objectFilter, queryOps).count();

    return broadcasts.map(broadcast => {
      return {
        ...broadcast,
        total,
        pages: Math.ceil(total / limit)
      };
    });
  } catch (err) {
    console.log('Error getting broadcast data from db: ', err);
  }
};

export const getTotal = async () => {
  try {
    const { Video } = models;
    const total = await Video.count();
    return total;
  } catch (err) {
    console.log('Error getting total video data from db: ', err);
  }
};

export const getVideoByTitle = async title => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ title });
    return video;
  } catch (err) {
    console.log('Error getting video data from db by title: ', err);
  }
};

export const getVideoById = async videoId => {
  try {
    const { Video } = models;
    const video = await Video.findOne({ videoId });
    return video;
  } catch (err) {
    console.log('Error getting video data from db by id: ', err);
  }
};

export const createVideo = async payload => {
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
    return await Video.findOneAndUpdate(
      { videoId },
      { $inc: { videoViews: 1 } }
    );
  } catch (err) {
    console.log('Error updating video views: ', err);
  }
};

export const deleteVideoById = async videoId => {
  try {
    const { Video } = models;
    const deletedVideo = await Video.deleteOne({ videoId });
    return deletedVideo;
  } catch (err) {
    console.log('Error deleting video by id: ', err);
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

export const createBroadcast = async payload => {
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

export const updateBroadcast = async (broadcastId, livestream) => {
  try {
    const { Broadcast } = models;
    const { collection, payload } = livestream;
    const { type } = payload;
    const filter = { broadcastId };
    const options = { new: true };
    const update = {
      ...livestream,
      playerUrl: payload.resourceUri,
      ...(collection && { collectionType: collection }),
      ...(type === 'archived' && { isActive: false })
    };
    const broadcast = await Broadcast.findOneAndUpdate(filter, update, options);
    return broadcast;
  } catch (err) {
    console.log('Error updating broadcast status: ', err);
  }
};

export const deleteBroadcast = async broadcastId => {
  try {
    const { Broadcast } = models;
    const deletedBroadcast = await Broadcast.deleteOne({
      'payload.id': broadcastId
    });
    return deletedBroadcast;
  } catch (err) {
    console.log('Error deleting video by id: ', err);
  }
};

export const getCategories = async query => {
  try {
    const { Category } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skipIndex = (page - 1) * limit;
    return await Category.find(query, queryOps)
      .sort({ _id: 1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();
  } catch (err) {
    console.log('Error getting category data from db: ', err);
  }
};

export const getCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ categoryId });
    return category;
  } catch (err) {
    console.log('Error getting catgeory data from db by id: ', err);
  }
};

export const getCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category;
  } catch (err) {
    console.log('Error getting category data from db by name: ', err);
  }
};

export const createCategory = async payload => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name: payload.name });
    if (category) {
      return [Error('category with name already exists.'), null];
    }
    const cat = new Category(payload);
    const createdCategory = await cat.save();
    const { description, name, categoryId } = createdCategory;
    return [null, { description, name, categoryId }];
  } catch (err) {
    console.log('Error saving video data to db: ', err);
  }
};

export const updateCategory = async (categoryId, name) => {
  try {
    const { Category } = models;
    const filter = { categoryId };
    const options = { new: true };
    const update = { name };
    const category = await Category.findOneAndUpdate(filter, update, options);
    return [null, category];
  } catch (err) {
    console.log('Error updating category data to db: ', err);
  }
};

export const deleteCategoryById = async categoryId => {
  try {
    const { Category } = models;
    const deletedCategory = await Category.deleteOne({ categoryId });
    return deletedCategory;
  } catch (err) {
    console.log('Error deleting video by id: ', err);
  }
};
