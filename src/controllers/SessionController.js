'use strict';

import { SessionService } from '../services';

exports.createSession = async (req, res, next) => {
  try {
    const response = await SessionService.createSession();
    res.json(response);
  } catch (err) {
    console.log(`Error with login: `, err);
    next(err);
  }
};
