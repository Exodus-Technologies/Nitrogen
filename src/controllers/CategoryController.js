'use strict';

import { CategoryService } from '../services';

exports.getCategories = async (req, res, next) => {
  try {
    const { query } = req;
    const [statusCode, payload] = await CategoryService.getCategories(query);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with getting categories: `, err);
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await CategoryService.getCategory(
      categoryId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(
      `Error with getting category metadata by id: ${categoryId}: `,
      err
    );
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { body } = req;
    const [statusCode, payload] = await CategoryService.createCategory(body);
    res.status(statusCode).send(payload);
  } catch (err) {
    console.log(`Error with creating new category: `, err);
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const [statusCode, response] = await CategoryService.updateCategory(
      categoryId,
      name
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with updating category: `, err);
    next(err);
  }
};

exports.deleteCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const [statusCode, response] = await CategoryService.deleteCategoryById(
      categoryId
    );
    res.status(statusCode).send(response);
  } catch (err) {
    console.log(`Error with deleting category by id: ${categoryId}: `, err);
    next(err);
  }
};
