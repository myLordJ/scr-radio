'use strict';
/* HOSTS AND CONTENT CREATORS */
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Program Schema
 */
var Programschema = new Schema({
  // admin data
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

  // display data
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  image: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  images: [ String ],
  links: {
    mixcloud: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    home: { type: String },
    instagram: { type: String }
  },
  categories: [ String ],
  description: {
    en: String,
    kr: String
  },
  residents: [ {
    type: Schema.ObjectId,
    ref: 'Resident'
  } ],
  featured: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Program', Programschema);
