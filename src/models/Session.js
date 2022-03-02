'use strict';

import mongoose from 'mongoose';
import config from '../config';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//SESSION SCHEMA
//  ============================================
const sessionSchema = new Schema(
  {
    apiKey: {
      type: String,
      required: true,
      index: true
    },
    sessionId: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
sessionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Session model out of sessionSchema
 */
const Session = mongoose.model('Session', sessionSchema);

export default Session;
