const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const Parameter = new Schema({
  key: {
    type: String, unique: true,
  },
  value: {
    type: String,
  },
  secret: {
    type: Boolean,
  },
}, {
  collection: 'parameters',
  timestamps: true,
});

module.exports = mongoose.model('Parameter', Parameter);
