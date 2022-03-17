'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';

const { Router } = express;
const router = Router();

router.get(
  '/video-service/getActiveBroadcast',
  BroadcastController.getActiveBroadcast
);

export default router;
