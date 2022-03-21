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
