'use strict';

import express from 'express';
import { CategoryController } from '../controllers';
import {
  categoryQueryValidation,
  categoryPostValidation,
  categoryIdParamValidation,
  categoryUpdateValidation
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

router.get(
  '/video-service/getCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.getCategory
);

router.post(
  '/video-service/createCategory',
  categoryPostValidation,
  validationHandler,
  CategoryController.createCategory
);

router.put(
  '/video-service/updateCategory/:categoryId',
  categoryUpdateValidation,
  validationHandler,
  CategoryController.updateCategory
);

router.delete(
  '/video-service/deleteCategory/:categoryId',
  categoryIdParamValidation,
  validationHandler,
  CategoryController.deleteCategoryById
);

export default router;
