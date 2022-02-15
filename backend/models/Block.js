const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Block = new Schema({
   name: {
      type: String
   },
   parameters: {
      type: [Object]
   },
   shared: {
      type: [Object]
   },
   script:{
      type: String
   },
   prescript:{
      type: String
   },
   lang:{
      type: String
   },
   desc:{
      type: String
   }
}, {
   collection: 'blocks'
})

module.exports = mongoose.model('Block', Block)