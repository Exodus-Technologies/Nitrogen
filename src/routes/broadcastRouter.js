'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';
import { validationHandler } from '../middlewares';
import {
  broadCastIdParamValidation,
  broadcastQueryValidation
} from '../validations';

const { Router } = express;
const router = Router();

router.get(
  '/video-service/getActiveBroadcast',
  BroadcastController.getActiveBroadcast
);

router.get(
  '/video-service/getBroadcasts',
  broadcastQueryValidation,
  validationHandler,
  BroadcastController.getBroadcasts
);

router.delete(
  '/video-service/deleteBroadcast/:broadcastId',
  broadCastIdParamValidation,
  validationHandler,
  BroadcastController.deleteBroadcast
);

export default router;
