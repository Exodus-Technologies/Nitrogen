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
