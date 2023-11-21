'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, query, param, validationResult } from 'express-validator';
import { VIDEO_STATUSES } from '../constants';

const videoQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for videos.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for videos.'),
  query('title')
    .isString()
    .withMessage('Must provide a existing video title.')
    .optional(),
  query('categories')
    .isString()
    .withMessage('Must provide a category for video to match with.')
    .optional(),
  query('userId')
    .isString()
    .withMessage('Must provide a valid userId.')
    .optional(),
  body('status')
    .isString()
    .custom(status => {
      if (!VIDEO_STATUSES.includes(status)) {
        throw new Error('Status submitted is not allowed for this field.');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .optional()
];

const appIdQueryValidation = [
  query('platform').isString().withMessage('Must provide a device platform.')
];

const videoIdBodyUpdateValidation = [
  body('videoId').isNumeric().withMessage('Must provide a existing video id.')
];

const videoIdParamValidation = [
  param('videoId').isString().withMessage('Must provide a existing video id.')
];

const categoryQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for categories.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for categories.'),
  query('name')
    .isString()
    .withMessage('Must provide a existing category name.')
    .optional()
];

const categoryPostValidation = [
  body('name').isString().withMessage('Must provide a category name.')
];

const categoryIdParamValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.')
];

const broadCastIdBodyValidation = [
  body('broadcastId').isString().withMessage('Must provide a broadcast id.')
];

const broadCastIdParamValidation = [
  param('broadcastId').isNumeric().withMessage('Must provide a broadcast id.')
];

const manualUploadBodyValidation = [
  body('title')
    .isString()
    .withMessage('Must provide a title for manual upload.'),
  body('description')
    .isString()
    .withMessage('Must provide a description for manual upload.'),
  body('categories')
    .isString()
    .withMessage('Must provide categories for manual upload.'),
  body('duration')
    .isString()
    .withMessage('Must provide video duration for manual upload.'),
  body('isAvailableForSale')
    .isBoolean()
    .optional()
    .withMessage('Must provide a boolean value if the asset is for sale.')
];

const categoryUpdateValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a category name.')
];

const broadcastQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for broadcasts.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for broadcasts.')
];

export {
  validationResult,
  videoQueryValidation,
  appIdQueryValidation,
  videoIdBodyUpdateValidation,
  videoIdParamValidation,
  categoryQueryValidation,
  categoryPostValidation,
  categoryUpdateValidation,
  categoryIdParamValidation,
  broadCastIdBodyValidation,
  broadCastIdParamValidation,
  broadcastQueryValidation,
  manualUploadBodyValidation
};
