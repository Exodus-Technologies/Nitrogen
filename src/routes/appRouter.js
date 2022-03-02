'use strict';

import express from 'express';

const { Router } = express;

const router = Router();

router.get('/video-service/', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Welcome to Nitrogen Video Manager Service!'
  });
});

router.get('/video-service/probeCheck', (_, res) => {
  res.json({
    statusCode: 200,
    message: 'Nitrogen Video Manager service up and running!'
  });
});

export default router;
