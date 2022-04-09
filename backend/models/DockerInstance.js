const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const DockerInstance = new Schema({
  parameters: {
    type: [Object],
  },
  container_id: {
    type: String,
  },
  instance: {
    type: String,
  },
  console: {
    type: [String],
  },
  output: {
    type: [Object],
  },
  done: {
    type: Boolean,
  },
  error: {
    type: Boolean,
  },
  runtime: {
    type: Object,
  },
  artifacts: {
    type: [String],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }
}, {
  collection: 'docker',
  timestamps: true,
});

module.exports = mongoose.model('DockerInstance', DockerInstance);
