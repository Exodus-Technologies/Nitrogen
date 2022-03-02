'use strict';

import mongoose from 'mongoose';
import config from '../config';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//BROADCAST SCHEMA
//  ============================================
const broadcastSchema = new Schema(
  {
    broadcastId: { type: String, required: true },
    sessionId: { type: String, required: true },
    archiveId: { type: String, required: true },
    archiveOptions: {
      sessionId: { type: String, required: true },
      hasAudio: {
        type: Boolean,
        required: true
      },
      hasVideo: {
        type: Boolean,
        required: true
      },
      layout: {
        type: {
          type: String,
          required: true
        },
        stylesheet: {
          type: String,
          required: true
        },
        screenshareType: {
          type: String,
          required: true
        }
      },
      name: { type: String, required: true },
      outputMode: { type: String, required: true },
      resolution: { type: String, required: true },
      streamMode: { type: String, required: true }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// "layout" : {
//   "type": "custom",
//   "stylesheet": "the layout stylesheet (only used with type == custom)",
//   "screenshareType": "the layout type to use when there is a screen-sharing stream (optional)"
// },
// "name" : "archive_name",
// "outputMode" : "composed",
// "resolution" : "640x480",
// "streamMode" : "auto"

/**
 * Set the autoCreate option on models if not on production
 */
broadcastSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Broadcast model out of broadcastSchema
 */
const Broadcast = mongoose.model('Broadcast', broadcastSchema);

export default Broadcast;
