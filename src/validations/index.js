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
  body('name').isString().withMessage('Must provide a category name.')
];

const categoryIdParamValidation = [
  param('categoryId')
    .isString()
    .withMessage('Must provide a existing category id.')
];

const categoryUpdateValidation = [
  body('categoryId')
    .isNumeric()
    .withMessage('Must provide a existing category id.'),
  body('name')
    .isString()
    .optional()
    .withMessage('Must provide a category name.')
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
  categoryIdParamValidation
};
