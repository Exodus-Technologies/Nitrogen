import express from 'express';
import { VideoController } from '../controllers';
import {
  videoIdUpdateValidation,
  videoQueryValidation,
  videoUpdateValidation,
  videoViewsUpdateValidation
} from '../validations';
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

router.get(
  '/video-service/getVideo/:videoId',
  videoIdUpdateValidation,
  validationHandler,
  VideoController.getVideo
);

router.put(
  '/video-service/updateVideo',
  videoUpdateValidation,
  validationHandler,
  VideoController.updateVideo
);

router.put(
  '/video-service/updateViews',
  videoViewsUpdateValidation,
  validationHandler,
  VideoController.updateViews
);

export default router;
