'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, query, param, validationResult } from 'express-validator';

const videoQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for videos'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for videos'),
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

const videoIdBodyUpdateValidation = [
  body('videoId').isString().withMessage('Must provide a existing video id.')
];

const videoIdParamValidation = [
  param('videoId').isString().withMessage('Must provide a existing video id.')
];

export {
  validationResult,
  videoQueryValidation,
  appIdQueryValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation
};
