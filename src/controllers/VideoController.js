'use strict';

import { VideoService } from '../services';

exports.uploadVideo = async (req, res, next) => {
  try {
    const file = await VideoService.getFileFromRequest(req);
    const response = await VideoService.uploadVideo(file);
    res.json(response);
  } catch (err) {
    console.log(`Error with uploading file to s3: `, err);
    next(err);
  }
};

exports.getVideos = async (req, res, next) => {
  try {
    const { query } = req;
    const response = await VideoService.getVideos(query);
    res.json(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateViews = async (req, res, next) => {
  try {
    const { videoName } = req.body;
    const response = await VideoService.updateViews(videoName);
    res.json(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};

exports.updateVideo = async (req, res, next) => {};
