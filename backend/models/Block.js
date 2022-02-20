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
   booleans: {
      type: [Object]
   },
   multis: {
      type: [Object]
   },
   script:{
      type: String
   },
   github: {
      type: Boolean
   },
   github_path: {
      type: String,
      required: false
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