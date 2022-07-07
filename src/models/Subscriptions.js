'use strict';

import mongoose from 'mongoose';
import config from '../config';
import { createSubscriptionId } from '../utilities';

const { Schema } = mongoose;
const { NODE_ENV } = config;

//ISSUE SCHEMA
//  ============================================
const subscriptionSchema = new Schema({
  subscriptionId: { type: String, default: createSubscriptionId() },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  purchaseDate: { type: String },
  amount: { type: Number, default: 15 },
  startDate: { type: String },
  endDate: { type: String }
});

/**
 * Set the autoCreate option on models if not on production
 */
subscriptionSchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Create Subscription model out of subscriptionSchema
 */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
