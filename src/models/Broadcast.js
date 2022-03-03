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
        type: Boolean
      },
      hasVideo: {
        type: Boolean
      },
      layout: {
        type: {
          type: String
        },
        stylesheet: {
          type: String
        },
        screenshareType: {
          type: String
        }
      },
      name: { type: String, required: true },
      outputMode: { type: String },
      resolution: { type: String },
      streamMode: { type: String }
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
