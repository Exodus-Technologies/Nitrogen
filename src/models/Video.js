'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import config from '../config';
import { AUTHOR, VIDEO_PUBLISHED_STATUS } from '../constants';
import { createSubId } from '../utilities';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

const { NODE_ENV } = config;

//VIDEO SCHEMA
//  ============================================
const videoSchema = new Schema(
  {
    subId: { type: String, default: createSubId() },
    title: { type: String },
    broadcastId: { type: String },
    url: { type: String, required: true },
    description: { type: String },
    totalViews: { type: Number, default: 0 },
    author: { type: String, default: AUTHOR },
    key: { type: String, required: true },
    isPaid: { type: Boolean, default: true },
    price: { type: String },
    thumbnail: { type: String },
    duration: { type: String },
    status: { type: String, default: VIDEO_PUBLISHED_STATUS },
    categories: { type: [String] }
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
