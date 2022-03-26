const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const Flow = new Schema({
  steps: {
    type: [[Object]],
  },
  name: {
    type: String,
    unique: true,
  },
  on_error: {
    type: String,
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  collection: 'flows',
  timestamps: true,
});

module.exports = mongoose.model('Flow', Flow);
