'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';

const { Router } = express;
const router = Router();

router.post(
  '/video-service/webHookCallback',
  BroadcastController.webHookCallback
);

export default router;
