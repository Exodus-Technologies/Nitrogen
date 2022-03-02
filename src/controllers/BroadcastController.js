'use strict';

import { BroadcastService } from '../services';

exports.createBroadcast = async (req, res, next) => {
  try {
    const response = await BroadcastService.createBroadcast();
    res.send(response);
  } catch (err) {
    console.log(`Error with login: `, err);
    next(err);
  }
};
