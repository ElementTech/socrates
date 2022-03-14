const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Flowviz = new Schema({
   nodes:{
      type: [Object]
   },
   links:{
      type: [Object]
   },
   name: {
      type: String,
      unique: true
   },
   on_error: {
      type: String
   },
   desc: {
      type: String
   },
   image: {
      type: String,
      required: false
   },
}, {
   collection: 'flows_viz',
   timestamps: true,
   strictQuery: false,
   strict: false
})

module.exports = mongoose.model('Flowviz', Flowviz)