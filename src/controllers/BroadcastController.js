'use strict';

import { BroadcastService } from '../services';

exports.getActiveBroadcast = async (_, res, next) => {
  try {
    const response = await BroadcastService.getActiveBroadcast();
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting active broadcast: `, err);
    next(err);
  }
};
