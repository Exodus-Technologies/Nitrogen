'use strict';

import { BroadcastService } from '../services';

exports.startBroadcast = async (req, res, next) => {
  try {
    const { archiveOptions } = req.body;
    const response = await BroadcastService.startBroadcast(archiveOptions);
    res.json(response);
  } catch (err) {
    console.log(`Error with starting broadcast: `, err);
    next(err);
  }
};

exports.stopBroadcast = async (_, res, next) => {
  try {
    const response = await BroadcastService.stopBroadcast();
    res.json(response);
  } catch (err) {
    console.log(`Error with stopping broadcast: `, err);
    next(err);
  }
};

exports.archiveCallback = async (req, res, next) => {
  try {
    const response = await BroadcastService.archiveCallback(req.body);
    res.json(response);
  } catch (err) {
    console.log(`Error with executing archiving callback for video: `, err);
    next(err);
  }
};
