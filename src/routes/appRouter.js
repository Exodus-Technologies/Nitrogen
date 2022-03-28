'use strict';

import express from 'express';
import { cache } from '../middlewares';

const { Router } = express;

const router = Router();

router.get('/video-service/', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Welcome to Nitrogen Video Manager Service!' });
});

router.get('/video-service/probeCheck', cache(), (_, res) => {
  res
    .status(200)
    .send({ message: 'Nitrogen Video Manager service up and running!' });
});

export default router;
