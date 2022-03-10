'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { STATUSES } from '../constants';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//VIDEO SCHEMA
//  ============================================
const videoSchema = new Schema(
  {
    broadcastId: { type: String },
    archiveId: { type: String },
    videoName: { type: String, required: true },
    sessionId: { type: String },
    url: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    author: { type: String, required: true },
    status: {
      type: String,
      enum: STATUSES,
      default: 'free'
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
videoSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Video model out of videoSchema
 */
const Video = mongoose.model('Video', videoSchema);

export default Video;
