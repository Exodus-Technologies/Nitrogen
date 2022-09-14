'use strict';

import { BroadcastService } from '../services';

exports.getActiveBroadcast = async (_, res, next) => {
  try {
    const [statusCode, payload] = await BroadcastService.getActiveBroadcast();
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with getting active broadcast: `, err);
    next(err);
  }
};

exports.getBroadcasts = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await BroadcastService.getBroadcasts(query);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with retrieving broadcasts: `, err);
    next(err);
  }
};

exports.deleteBroadcast = async (req, res, next) => {
  try {
    const { broadcastId } = req.params;
    const [statusCode] = await BroadcastService.deleteBroadcast(broadcastId);
    res.status(statusCode).end();
  } catch (err) {
    console.log(`Error with deleting video by id: ${videoId}: `, err);
    next(err);
  }
};
