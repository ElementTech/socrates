const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let FlowvizInstance = new Schema({
   nodes:{
      type: [Object] 
   },
   links:{
      type: [Object]
   },
   flow:{
      type: String // Flow ID
   },
   on_error: {
      type: String
   },
   done: {
      type: Boolean
   },
   error: {
      type: Boolean
   },
   runtime:{
      type: Object
   },
   run_id:{
      type: String
   },
   instance_id:{
      type: String
   }
}, {
   collection: 'flowviz_instances',
   timestamps: true
})

module.exports = mongoose.model('FlowvizInstance', FlowvizInstance)