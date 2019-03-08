'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const contractSchema = new Schema({
  parent: {
    type: ObjectId,
    ref: 'User'
  },
  babysitter: {
    type: ObjectId,
    ref: 'User'
  }
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
