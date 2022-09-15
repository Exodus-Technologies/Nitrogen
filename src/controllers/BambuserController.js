'use strict';

import { BambuserService } from '../services';

exports.getApplicationId = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, response] = await BambuserService.getApplicationId(
      query
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with retrieving application id: `, err);
    next(err);
  }
};

exports.webHookCallback = async (req, res, next) => {
  try {
    const { eventId, action } = req.body;
    if (eventId) {
      if (action !== 'remove') {
        const [statusCode] = await BambuserService.webHookCallback(req.body);
        if (statusCode === 200) {
          res.status(200).end();
        }
      }
    }
    res.status(200).end();
  } catch (err) {
    console.log(`Error with invoking webhook for broadcast details: `, err);
    next(err);
  }
};

exports.getMP4DownloadStatus = async (req, res, next) => {
  try {
    const { broadcastId } = req.body;
    const [statusCode, response] = await BambuserService.getMP4DownloadStatus(
      broadcastId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting livestream data: `, err);
    next(err);
  }
};

exports.uploadLivestream = async (req, res, next) => {
  try {
    const { broadcastId } = req.body;
    const [statusCode, response] = await BambuserService.uploadLivestream(
      broadcastId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with moving livestream data to s3: `, err);
    next(err);
  }
};
