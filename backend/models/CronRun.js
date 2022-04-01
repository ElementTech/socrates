const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const CronRun = new Schema({
  run_id: {
    type: String
  },
  component_id: {
    type: String
  },
  type: {
    type: String
  },
  job: {
    type: String
  },
  done: {
    type: Boolean
  },
  error: {
    type: Boolean
  }
}, {
  collection: 'crons',
  timestamps: true,
  capped: { size: 300000, max: 1000 }
});

module.exports = mongoose.model('CronRun', CronRun);
