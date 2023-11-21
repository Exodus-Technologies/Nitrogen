import express from 'express';
import { appIdQueryValidation } from '../validations';
import { validationHandler, cache } from '../middlewares';
import { BambuserController } from '../controllers';

const { Router } = express;
const router = Router();

router.get(
  '/video-service/getApplicationId',
  appIdQueryValidation,
  validationHandler,
  cache(),
  BambuserController.getApplicationId
);

router.post(
  '/video-service/webHookCallback',
  BambuserController.webHookCallback
);

export default router;
