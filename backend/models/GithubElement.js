const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const GithubElement = new Schema({
  path: {
    type: String,
  },
  content: {
    type: String,
  },
  prefix: {
    type: String,
  },
  sha: {
    type: String,
  },
}, {
  collection: 'github',
  timestamps: true,
});

module.exports = mongoose.model('GithubElement', GithubElement);
