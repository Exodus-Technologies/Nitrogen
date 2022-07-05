import express from 'express';

const { Router } = express;
import { SubscriptionController } from '../controllers';
import {
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionPutBodyValidation,
  subscriptionStatusQueryValidation,
  subscriptionIdParamValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const router = Router();

router.get(
  '/video-service/getSubscriptions',
  subscriptionQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptions
);

router.get(
  '/video-service/getSubscriptionStatus',
  subscriptionStatusQueryValidation,
  validationHandler,
  SubscriptionController.getSubscriptionStatus
);

router.post(
  '/video-service/createSubscription',
  subscriptionPostBodyValidation,
  validationHandler,
  SubscriptionController.createSubscription
);

router.put(
  '/video-service/updateSubscription',
  subscriptionPutBodyValidation,
  validationHandler,
  SubscriptionController.updateSubscription
);

router.delete(
  '/video-service/deleteSubscription/:subscriptionId',
  subscriptionIdParamValidation,
  validationHandler,
  SubscriptionController.deleteSubscriptionById
);

export default router;
