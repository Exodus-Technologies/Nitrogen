'use strict';

import mongoose from 'mongoose';
import config from '../config';
import mongooseSequence from 'mongoose-sequence';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

//BROADCAST SCHEMA
//  ============================================
const broadcastSchema = new Schema(
  {
    title: { type: String, required: true },
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
broadcastSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments videoId everytime an instances is created
 */
broadcastSchema.plugin(autoIncrement, { inc_field: 'broadcastId' });

/**
 * Create Broadcast model out of broadcastSchema
 */
const Broadcast = mongoose.model('Broadcast', broadcastSchema);

export default Broadcast;
