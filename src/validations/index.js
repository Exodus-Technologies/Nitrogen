'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, query, validationResult } from 'express-validator';

const videoQueryValidation = [
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for users')
    .optional()
    .default(30),
  query('title')
    .isString()
    .withMessage('Must provide a existing video title')
    .optional(),
  query('author')
    .isString()
    .withMessage('Must provide a valid video author')
    .optional(),
  body('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free videos')
    .optional()
];

const appIdQueryValidation = [
  query('platform').isString().withMessage('Must provide a device platform.')
];

const videoUpdateValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a new video title')
    .optional(),
  body('author')
    .isString()
    .withMessage('Must provide a valid video author')
    .optional(),
  body('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free videos')
    .optional()
];

const videoViewsUpdateValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.')
];

const bambsterBroadcastValidation = [
  body('eventId').isString().withMessage('Must provide a valid eventId.')
];

export {
  validationResult,
  videoQueryValidation,
  videoUpdateValidation,
  appIdQueryValidation,
  videoViewsUpdateValidation,
  bambsterBroadcastValidation
};
