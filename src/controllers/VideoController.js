'use strict';

import { VideoService } from '../services';

exports.uploadVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromRequest(req);
    const [statusCode, response] = await VideoService.uploadVideo(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with uploading file to s3: `, err);
    next(err);
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const [statusCode, payload] = await VideoService.getVideo(videoId);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with getting video by id: ${videoId}: `, err);
    next(err);
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await VideoService.getVideos(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const [statusCode, payload] = await VideoService.updateViews(videoId);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromRequest(req);
    const [statusCode, response] = await VideoService.updateVideo(payload);
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating video: `, err);
    next(err);
  }
};
