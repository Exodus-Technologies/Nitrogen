'use strict';

import {
  getCategories,
  createCategory,
  deleteCategoryById,
  updateCategory,
  getCategoryById
} from '../mongodb';
import { badImplementationRequest, badRequest } from '../response-codes';

exports.getCategories = async query => {
  try {
    const categories = await getCategories(query);
    if (categories) {
      return [
        200,
        { message: 'Categories fetched from db with success', categories }
      ];
    } else {
      return badRequest(
        `Unable to find categories that matched the search criteria.`
      );
    }
  } catch (err) {
    console.log('Error getting categories: ', err);
    return badImplementationRequest('Error getting categories.');
  }
};

exports.getCategory = async categoryId => {
  try {
    const category = await getCategoryById(categoryId);
    if (category) {
      return [
        200,
        { message: 'Category fetched from db with success', category }
      ];
    } else {
      return badRequest(`No category found with id provided.`);
    }
  } catch (err) {
    console.log('Error getting category by id ', err);
    return badImplementationRequest('Error getting category by id.');
  }
};

exports.createCategory = async payload => {
  try {
    const [error, category] = await createCategory(payload);
    if (category) {
      return [200, { message: 'Category created with success.', category }];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log('Error creating new category: ', err);
    return badImplementationRequest('Error creating new category.');
  }
};

exports.updateCategory = async (categoryId, name) => {
  try {
    const [error, category] = await updateCategory(categoryId, name);
    if (category) {
      return [200, { message: 'Category updated with success.', category }];
    } else {
      return badRequest(error.message);
    }
  } catch (err) {
    console.log('Error updating existing category: ', err);
    return badImplementationRequest('Error updating existing category.');
  }
};

exports.deleteCategoryById = async categoryId => {
  try {
    const [error, deletedCategory] = await deleteCategoryById(categoryId);
    if (deletedCategory) {
      return [204];
    }
    return badRequest(error.message);
  } catch (err) {
    console.log('Error deleting category by id: ', err);
    return badImplementationRequest('Error deleting category by id.');
  }
};
