'use strict';

import { BambuserService } from '../services';

exports.getApplicationId = async (req, res, next) => {
  try {
    const { query } = req;
    const response = await BambuserService.getApplicationId(query);
    res.json(response);
  } catch (err) {
    console.log(`Error with retrieving application id: `, err);
    next(err);
  }
};
