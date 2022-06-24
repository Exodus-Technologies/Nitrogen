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
  query('author')
    .isString()
    .withMessage('Must provide a valid video author.')
    .optional(),
  query('categories')
    .isString()
    .withMessage('Must provide a category for video to match with.')
    .optional(),
  query('userId')
    .isString()
    .withMessage('Must provide a valid userId.')
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
  body('name').isString().withMessage('Must provide a category name.'),
  body('description')
    .isString()
    .isLength({ max: 255 })
    .withMessage('Must provide a category name.')
];

const categoryUpdateValidation = [
  body('categoryId')
    .isNumeric()
    .withMessage('Must provide a existing category id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a category name.'),
  body('description')
    .isString()
    .optional()
    .isLength({ max: 255 })
    .withMessage('Must provide a category name.')
];

const categoryIdParamValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.')
];

const subscriptionQueryValidation = [
  query('page')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a page for issues.'),
  query('limit')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Must provide a limit for issues.')
];

const subscriptionPostBodyValidation = [
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
];

const subscriptionStatusQueryValidation = [
  query('userId').isString().withMessage('Must provide a valid userId.')
];

const subscriptionPutBodyValidation = [
  body('startDate')
    .isString()
    .withMessage('Must provide a valid startDate for subscription.'),
  body('userId').isNumeric().withMessage('Must provide a valid userId.')
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
  subscriptionQueryValidation,
  subscriptionPostBodyValidation,
  subscriptionPutBodyValidation,
  subscriptionStatusQueryValidation
};
