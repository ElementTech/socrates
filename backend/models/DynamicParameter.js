const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const DynamicParameter = new Schema({
  name: {
    type: String, unique: true,
  },
  script: {
    type: String,
  },
  lang: {
    type: String,
  },
  output: {
    type: Array,
    required: false,
  },
}, {
  collection: 'dynamics',
  timestamps: true,
});

module.exports = mongoose.model('DynamicParameter', DynamicParameter);
