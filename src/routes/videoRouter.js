import express from 'express';
import { VideoController } from '../controllers';
import {
  videoIdParamValidation,
  videoQueryValidation,
  videoIdBodyUpdateValidation
} from '../validations';
import { validationHandler, cache } from '../middlewares';

const { Router } = express;
const router = Router();

router.post('/video-service/uploadVideo', VideoController.uploadVideo);

router.get(
  '/video-service/getVideos',
  videoQueryValidation,
  validationHandler,
  cache(),
  VideoController.getVideos
);

router.get(
  '/video-service/getVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  cache(),
  VideoController.getVideo
);

router.put('/video-service/updateVideo', VideoController.updateVideo);

router.put(
  '/video-service/updateViews',
  videoIdBodyUpdateValidation,
  validationHandler,
  VideoController.updateViews
);

router.delete(
  '/video-service/deleteVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
  VideoController.deleteVideoById
);

export default router;
