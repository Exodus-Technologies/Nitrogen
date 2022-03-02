'use strict';

import { BroadcastService } from '../services';

exports.startBroadcast = async (req, res, next) => {
  try {
    const { archiveOptions } = req.body;
    const response = await BroadcastService.startBroadcast(archiveOptions);
    res.send(response);
  } catch (err) {
    console.log(`Error with starting broadcast: `, err);
    next(err);
  }
};

exports.stopBroadcast = async (req, res, next) => {
  try {
    const response = await BroadcastService.stopBroadcast();
    res.send(response);
  } catch (err) {
    console.log(`Error with starting broadcast: `, err);
    next(err);
  }
};
