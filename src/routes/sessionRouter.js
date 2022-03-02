'use strict';

import express from 'express';
import { SessionController } from '../controllers';

const { Router } = express;
const router = Router();

router.post('/video-service/createSession', SessionController.createSession);

export default router;
