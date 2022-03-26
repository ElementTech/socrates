const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const Settings = new Schema({
  langs: {
    type: [Object], // {Python: {Default_Image: "latest","Run Command":"python"}}
  },
  github: {
    type: [Object],
  },
  docker_auth: {
    type: [Object],
    required: false,
  },
}, {
  collection: 'settings',
  timestamps: true,
});

module.exports = mongoose.model('Settings', Settings);
