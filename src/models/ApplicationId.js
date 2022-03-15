'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { PLATFORMS } from '../constants';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//ApplicationId SCHEMA
//  ============================================
const applicationIdSchema = new Schema(
  {
    platform: { type: String, required: true, enum: PLATFORMS },
    appId: { type: String }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
applicationIdSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create ApplicationId model out of applicationIdSchema
 */
const ApplicationId = mongoose.model(
  'ApplicationId',
  applicationIdSchema,
  'applicationIds'
);

export default ApplicationId;
