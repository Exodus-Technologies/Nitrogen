'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';
import { startBroadcastValidation } from '../validations';
import { validationHandler } from '../utils';

const { Router } = express;
const router = Router();

router.post(
  '/video-service/startBroadcast',
  startBroadcastValidation,
  validationHandler,
  BroadcastController.startBroadcast
);

router.post('/video-service/stopBroadcast', BroadcastController.stopBroadcast);

export default router;
