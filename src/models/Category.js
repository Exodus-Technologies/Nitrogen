'use strict';

import mongoose from 'mongoose';
import config from '../config';
import mongooseSequence from 'mongoose-sequence';

const { Schema } = mongoose;
const autoIncrement = mongooseSequence(mongoose);
const { NODE_ENV } = config;

//CATEGORY SCHEMA
//  ============================================
const categorySchema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
categorySchema.set('autoCreate', NODE_ENV !== 'production');

/**
 * Increments categoryId everytime an instances is created
 */
categorySchema.plugin(autoIncrement, { inc_field: 'categoryId' });

/**
 * Create Category model out of categorySchema
 */
const Category = mongoose.model('Category', categorySchema);

export default Category;
