'use strict';

import mongoose from 'mongoose';
import config from '../config';
import mongooseSequence from 'mongoose-sequence';
import { AUTHOR } from '../constants';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

//VIDEO SCHEMA
//  ============================================
const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    broadcastId: { type: String },
    url: { type: String, required: true },
    description: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    author: { type: String, default: AUTHOR },
    key: { type: String, required: true },
    avaiableForSale: { type: Boolean, default: false },
    thumbnail: { type: String },
    duration: { type: String, required: true },
    categories: { type: [String], required: true }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
videoSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments videoId everytime an instances is created
 */
videoSchema.plugin(autoIncrement, { inc_field: 'videoId' });

/**
 * Create Video model out of videoSchema
 */
const Video = mongoose.model('Video', videoSchema);

export default Video;
