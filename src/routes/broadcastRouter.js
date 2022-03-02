'use strict';

import express from 'express';
import { BroadcastController } from '../controllers';
// import {} from '../validations';
import { validationHandler } from '../utils';

const { Router } = express;
const router = Router();

router.post(
  '/video-service/createBroadcast',
  BroadcastController.createBroadcast
);

// router.post(
//   '/auth-service/changePassword',
//   loginValidation,
//   validationHandler,
//   AuthController.changePassword
// );

// router.post(
//   '/auth-service/signup',
//   userCreationValidation,
//   validationHandler,
//   UserController.createUser
// );

export default router;
