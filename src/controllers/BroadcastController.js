'use strict';

import { BroadcastService } from '../services';

exports.webHookCallback = async (req, res, next) => {
  try {
    const response = await BroadcastService.webHookCallback(req.body);
    res.json(response);
  } catch (err) {
    console.log(`Error with updating metadata for broadcast details: `, err);
    next(err);
  }
};
