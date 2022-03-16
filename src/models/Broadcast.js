'use strict';

import mongoose from 'mongoose';
import config from '../config';
import mongooseSequence from 'mongoose-sequence';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

const stringSchema = { type: String };
const numberSchema = { type: Number };

//BROADCAST SCHEMA
//  ============================================
/**
 * Example payload for broadcast body from bambuser
 * 
 *{
   "action": "add",
  "collection": "broadcast",
  "payload": {
    "author": "Sveninge Bambuser",
    "created": 1474033783,
    "customData": "",
    "height": 540,
    "id": "9353eaec-794f-11e6-97c0-f19001529702",
    "ingestChannel": "cfc8626c-9a0e-ab78-6424-3eb0978d8e45",
    "lat": 63.205312,
    "length": 0,
    "lon": 17.13011,
    "positionAccuracy": 25,
    "positionType": "GPS",
    "preview": "https://archive.bambuser.com/9353eaec-794f-11e6-97c0-f19001529702.jpg",
    "resourceUri": "https://cdn.bambuser.net/broadcasts/9353eaec-794f-11e6-97c0-f19001529702?da_signature_method=HMAC-SHA256&da_id=9353eaec-794f-11e6-97c0-f19001529702&da_timestamp=1474033783&da_static=1&da_ttl=0&da_signature=eaf4c9cb29c58b910dcbad17cf7d8a3afa4e6a963624ba4c4fd0bb5bade1cdd6",
    "tags": [
      {
        "text": "whoa"
      }
    ],
    "title": "Amazing!",
    "type": "live",
    "width": 960
  },
  "eventId": "93df93061a891c23"
}
 */
const broadcastSchema = new Schema(
  {
    action: stringSchema,
    collectionType: stringSchema,
    title: stringSchema,
    payload: {
      author: stringSchema,
      created: numberSchema,
      customData: stringSchema,
      height: numberSchema,
      id: stringSchema,
      ingestChannel: stringSchema,
      lat: numberSchema,
      length: numberSchema,
      lon: numberSchema,
      positionAccuracy: numberSchema,
      positionType: stringSchema,
      preview: stringSchema,
      resourceUri: stringSchema,
      tags: { type: Array, default: [] },
      title: stringSchema,
      type: stringSchema,
      width: numberSchema
    },
    eventId: stringSchema,
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
