'use strict';

import { getCategories, saveCategoryRefToDB } from '../mongodb';
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

exports.createCategory = async payload => {
  try {
    const category = await saveCategoryRefToDB(payload);
    if (category) {
      return [200, { message: 'Category created with success.', category }];
    } else {
      return badRequest(`Unable to create category.`);
    }
  } catch (err) {
    console.log('Error creating new category: ', err);
    return badImplementationRequest('Error creating new category.');
  }
};
