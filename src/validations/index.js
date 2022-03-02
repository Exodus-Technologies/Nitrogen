'use strict';

/**
 * https://github.com/validatorjs/validator.js#validators
 */
import { body, validationResult } from 'express-validator';

/**
 * "sessionId" : "session_id",
    "hasAudio" : true,
    "hasVideo" : true,
    "layout" : {
      "type": "custom",
      "stylesheet": "the layout stylesheet (only used with type == custom)",
      "screenshareType": "the layout type to use when there is a screen-sharing stream (optional)"
    },
    "name" : "archive_name",
    "outputMode" : "composed",
    "resolution" : "640x480",
    "streamMode" : "auto"
 */
const startBroadcastValidation = [
  body('sessionId')
    .isString()
    .withMessage('Must provide an existing and valid sessionId'),
  body('hasAudio')
    .isBoolean()
    .withMessage('Must provide a boolean setting for audio')
    .optional(),
  body('hasVideo')
    .isBoolean()
    .withMessage('Must provide a boolean setting for video')
    .optional(),
  body('laylout')
    .isObject()
    .not()
    .isEmpty()
    .withMessage('Must provide a valid layout object')
    .optional(),
  body('laylout.type')
    .isString()
    .withMessage('Must provide a valid layout type')
    .optional(),
  body('laylout.stylesheet')
    .isString()
    .withMessage('Must provide a valid layout stylesheet')
    .optional(),
  body('laylout.screenshareType')
    .isString()
    .withMessage('Must provide a valid layout screenshareType')
    .optional(),
  body('name').isString().withMessage('Must provide a name for the archive'),
  body('outputMode')
    .isString()
    .withMessage('Must provide a string setting for video outputMode')
    .optional(),
  body('resolution')
    .isString()
    .withMessage('Must provide a string setting for video resolution')
    .optional(),
  body('streamMode')
    .isString()
    .withMessage('Must provide a string setting for video streamMode')
    .optional()
];

export { validationResult, startBroadcastValidation };
