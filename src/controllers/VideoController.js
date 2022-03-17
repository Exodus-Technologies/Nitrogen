'use strict';

import { VideoService } from '../services';

exports.uploadVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromRequest(req);
    const response = await VideoService.uploadVideo(payload);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with uploading file to s3: `, err);
    next(err);
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const response = await VideoService.getVideo(videoId);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with getting video by id: ${videoId}: `, err);
    next(err);
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const { query } = req;
    const response = await VideoService.getVideos(query);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { videoId } = req.body;
    const response = await VideoService.updateViews(videoId);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {
  try {
    const payload = await VideoService.getPayloadFromRequest(req);
    const response = await VideoService.updateVideo(payload);
    res.status(response.statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating video: `, err);
    next(err);
  }
};
