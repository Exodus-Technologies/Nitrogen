import express from 'express';
import { VideoController } from '../controllers';
import { videoQueryValidation } from '../validations';
import { validationHandler } from '../utils';

const { Router } = express;
const router = Router();

router.post('/video-service/uploadVideo', VideoController.uploadVideo);

router.get(
  '/video-service/getVideos',
  videoQueryValidation,
  validationHandler,
  VideoController.getVideos
);

router.put('/video-service/updateVideo', VideoController.updateVideo);

router.put('/video-service/updateClicks', VideoController.updateClicks);

export default router;
