const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define collection and schema
const FlowInstance = new Schema({
  run: {
    type: [[Object]], // [[{instance_id : docker_instance_id},{1234:5678}],[{abcd:efgh}]]
  },
  flow: {
    type: String, // Flow ID
  },
  done: {
    type: Boolean,
  },
  on_error: {
    type: String,
  },
  skipped: {
    type: Boolean,
    required: false,
  },
  error: {
    type: Boolean,
  },
  runtime: {
    type: Object,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }
}, {
  collection: 'flow_instances',
  timestamps: true,
});

module.exports = mongoose.model('FlowInstance', FlowInstance);
