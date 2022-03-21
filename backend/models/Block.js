const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Block = new Schema({
   name: {
      type: String,
      unique: true
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
   dynamic: {
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
   },
   image: {
      type: String,
      required: false
   },
   user: {
      type: Schema.Types.ObjectId, ref:  "User",
      required: false
   }
}, {
   collection: 'blocks',
   timestamps: true
})

module.exports = mongoose.model('Block', Block)