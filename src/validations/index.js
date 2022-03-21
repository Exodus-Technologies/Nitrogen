'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, query, param, validationResult } from 'express-validator';

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
  query('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free videos')
    .optional()
];

const appIdQueryValidation = [
  query('platform').isString().withMessage('Must provide a device platform.')
];

const videoCreateValidation = [
  body('title')
    .isString()
    .custom(value => !/\s/.test(value))
    .withMessage('Must provide a new video title'),
  body('author').isString().withMessage('Must provide a valid video author'),
  body('description')
    .isString()
    .isLength({ min: 5, max: 255 })
    .withMessage('Must provide a description for the video'),
  body('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free videos')
];

const videoUpdateValidation = [
  body('title')
    .isString()
    .custom(value => !/\s/.test(value))
    .withMessage('Must provide a new video title')
    .optional(),
  body('author')
    .isString()
    .withMessage('Must provide a valid video author')
    .optional(),
  body('description')
    .isString()
    .isLength({ max: 255 })
    .withMessage('Must provide a description for the video')
    .optional(),
  body('paid')
    .isBoolean()
    .withMessage('Must provide a valid status for paid vs free videos')
    .optional()
];

const videoViewsUpdateValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.')
];

const videoIdUpdateValidation = [
  param('videoId').isString().withMessage('Must provide a existing video id.')
];

export {
  validationResult,
  videoQueryValidation,
  videoUpdateValidation,
  appIdQueryValidation,
  videoViewsUpdateValidation,
  videoIdUpdateValidation,
  videoCreateValidation
};
