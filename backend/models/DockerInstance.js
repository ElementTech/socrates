const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let DockerInstance = new Schema({
   parameters: {
      type: [Object]
   },
   container_id: {
      type: String
   },
   instance: {
      type: String
   },
   console: {
      type: [String]
   },
   done:{
      type: Boolean
   },
   error:{
      type: Boolean
   },
   runtime:{
      type: Object
   },
   artifacts:{
      type: [String]
   }
}, {
   collection: 'docker'
})

module.exports = mongoose.model('DockerInstance', DockerInstance)