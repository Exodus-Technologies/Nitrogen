'use strict';

import config from '../config';
import models from '../models';
import { DEFAULT_SUBSCRIPTION_TYPE } from '../constants';
import {
  createMoment,
  getSubscriptionStartDate,
  getSubscriptionEndDate,
  createFormattedDate
} from '../utilities';

const { dbUser, dbPass, clusterName, dbName } = config.sources.database;

export const generateDBUri = () => {
  return `mongodb+srv://${dbUser}:${dbPass}@${clusterName}.ybdno.mongodb.net/${dbName}?retryWrites=true&w=majority`;
};

const queryOps = { __v: 0, _id: 0 };

export const getVideos = async query => {
  try {
    const { Video, Subscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const userId = parseInt(query.userId);
    const skipIndex = (page - 1) * limit;
    const subscriptions = userId
      ? await Subscription.find({ userId, type: DEFAULT_SUBSCRIPTION_TYPE })
          .sort({
            endDate: 'desc'
          })
          .limit(1)
      : null;
    const q = {
      ...query,
      ...(query.categories && {
        categories: {
          $in: [...query.categories.split(',').map(item => item.trim())]
        }
      })
    };

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
      const isPaid =
        subscriptions && subscriptions.length
          ? createMoment(video.createdAt).isBefore(
              createMoment(subscriptions[0].endDate)
            )
          : false;
      return {
        ...video,
        total,
        pages: Math.ceil(total / limit),
        myVideo: video.avaiableForSale && isPaid ? true : false
      };
    });
  } catch (err) {
    console.log('Error getting video data from db: ', err);
  }
};

export const getTotal = async () => {
  try {
    const { Issue } = models;
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

export const saveVideoRefToDB = async payload => {
  try {
    const { Video } = models;
    const video = new Video(payload);
    const createdVideo = await video.save();
    const { title, url, description, totalViews, author, videoId } =
      createdVideo;
    return { title, url, description, totalViews, author, videoId };
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
      return video;
    }
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

export const getCategoryByName = async name => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name });
    return category;
  } catch (err) {
    console.log('Error getting category data from db by name: ', err);
  }
};

export const saveCategoryRefToDB = async payload => {
  try {
    const { Category } = models;
    const category = await Category.findOne({ name: payload.name });
    if (category) {
      return [Error('category with name already exists.')];
    }
    const cat = new Category(payload);
    const createdCategory = await cat.save();
    const { description, name, categoryId } = createdCategory;
    return [null, { description, name, categoryId }];
  } catch (err) {
    console.log('Error saving video data to db: ', err);
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

export const getSubscriptions = async query => {
  try {
    const { Subscription } = models;
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const sort = query.sort || '-startDate';
    const skipIndex = (page - 1) * limit;

    const match = {
      type: DEFAULT_SUBSCRIPTION_TYPE
    };

    if (query.userId) {
      match.userId = +query.userId;
    }

    const aggregate = [
      {
        $match: match
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'userId',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      }
    ];
    const total = await Subscription.countDocuments(match).exec();
    const items = await Subscription.aggregate([
      ...aggregate,
      {
        $skip: skipIndex
      },
      {
        $limit: limit
      }
    ])
      .sort(sort)
      .exec();
    return { items, total };
  } catch (err) {
    console.log('Error getting subscription data from db: ', err);
  }
};

export const createSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { userId } = payload;
    const subscriptions = await Subscription.find({
      userId,
      type: DEFAULT_SUBSCRIPTION_TYPE
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);
    if (subscriptions.length < 1) {
      const body = {
        ...payload,
        startDate: payload.startDate
          ? createFormattedDate(payload.startDate)
          : getSubscriptionStartDate(),
        endDate: payload.endDate
          ? createFormattedDate(payload.endDate)
          : getSubscriptionEndDate(),
        purchaseDate: payload.purchaseDate
          ? createFormattedDate(payload.purchaseDate)
          : getSubscriptionStartDate()
      };

      const subscription = new Subscription(body);
      const createdSubscription = await subscription.save();
      const {
        startDate,
        endDate,
        type,
        purchaseDate,
        amount,
        userId,
        subscriptionId
      } = createdSubscription;
      return [
        null,
        {
          startDate,
          endDate,
          type,
          purchaseDate,
          amount,
          userId,
          subscriptionId
        }
      ];
    }
    return [
      new Error('Subscription for user is inactive. Please renew subscription.')
    ];
  } catch (err) {
    console.log('Error saving subscription data to db: ', err);
  }
};

export const updateSubscription = async payload => {
  try {
    const { Subscription } = models;
    const { userId, startDate } = payload;
    const subscriptions = await Subscription.find({
      userId,
      type: DEFAULT_SUBSCRIPTION_TYPE
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);

    if (subscriptions) {
      const subscription = subscriptions[0];
      const filter = { subscriptionId: subscription.subscriptionId };
      const options = { upsert: true, new: true };
      const update = {
        ...payload,
        endDate: getSubscriptionEndDate(startDate)
      };
      const updatedSubscription = await Subscription.findOneAndUpdate(
        filter,
        update,
        options
      );
      return [null, updatedSubscription];
    }
    return [new Error('No subscriptions to update')];
  } catch (err) {
    console.log('Error updating subscription data to db: ', err);
  }
};

export const getSubscriptionStatus = async query => {
  try {
    const { Subscription } = models;
    const { userId } = query;
    const subscriptions = await Subscription.find({
      userId,
      type: DEFAULT_SUBSCRIPTION_TYPE
    })
      .sort({
        endDate: 'desc'
      })
      .limit(1);
    let subscriptionStatusText = '';
    let endDateResult = createMoment();
    if (subscriptions.length) {
      const subscription = subscriptions[0];
      const endDate = createMoment(subscription.endDate);
      const currentDate = createMoment();
      const diffInDays = endDate.diff(currentDate, 'days');
      if (Math.sign(diffInDays) > 0) {
        subscriptionStatusText = `Subscription ends in ${diffInDays} days.`;
        endDateResult = endDate;
      } else {
        subscriptionStatusText = `Subscription expired ${diffInDays} days ago.`;
        endDate = currentDate;
      }
    }
    return [
      {
        subscriptionStatus: subscriptionStatusText,
        endDate: endDateResult.format('YYYY-MM-DD')
      }
    ];
  } catch (err) {
    console.log('Error saving subscription data to db: ', err);
  }
};
