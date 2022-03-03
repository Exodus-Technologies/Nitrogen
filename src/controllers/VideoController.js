'use strict';

import { VideoService } from '../services';

exports.uploadVideo = async (req, res, next) => {
  try {
    const file = await VideoService.getFileFromRequest(req);
    const response = await VideoService.uploadVideo(file);
    res.json(response);
  } catch (err) {
    console.log(`Error with uploading files to s3: `, err);
    next(err);
  }
};
