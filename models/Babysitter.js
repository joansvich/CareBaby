'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const babySitterSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  description: {
    type: String
  },
  client: {
    type: ObjectId,
    ref: 'User'
  }
});

const Babysitter = mongoose.model('Babysitter', babySitterSchema);

module.exports = Babysitter;
