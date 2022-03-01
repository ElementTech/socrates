const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let FlowvizInstance = new Schema({
   nodes:{
      type: [Object] 
   },
   link:{
      type: [Object]
   },
   flow:{
      type: String // Flow ID
   },
   done: {
      type: Boolean
   },
   error: {
      type: Boolean
   },
   runtime:{
      type: Object
   }
}, {
   collection: 'flowviz_instances'
})

module.exports = mongoose.model('FlowvizInstance', FlowvizInstance)