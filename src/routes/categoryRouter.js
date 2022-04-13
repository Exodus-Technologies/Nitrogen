'use strict';

import express from 'express';
import { CategoryController } from '../controllers';
import {
  categoryQueryValidation,
  categoryPostValidation,
  categoryIdParamValidation
} from '../validations';
import { validationHandler } from '../middlewares';

const { Router } = express;
const router = Router();

router.get(
  '/video-service/getCategories',
  categoryQueryValidation,
  validationHandler,
  CategoryController.getCategories
);

router.post(
  '/video-service/createCategory',
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.delete(
  '/video-service/deleteCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategoryById
);

export default router;
