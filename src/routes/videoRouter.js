import express from 'express';
import { VideoController } from '../controllers';
import {
  videoIdParamValidation,
  videoQueryValidation,
  videoIdBodyUpdateValidation,
  manualUploadBodyValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const { Router } = express;
const router = Router();

router.post('/video-service/uploadVideo', VideoController.uploadVideo);

router.post(
  '/video-service/manualUpload',
  manualUploadBodyValidation,
  VideoController.manualUpload
);

router.get('/video-service/getTotal', VideoController.getTotal);

router.get(
  '/video-service/getVideos',
  videoQueryValidation,
  validationHandler,
  VideoController.getVideos
);

router.get(
  '/video-service/getVideo/:videoId',
  videoIdParamValidation,
  validationHandler,
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
