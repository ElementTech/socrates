const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Flow = new Schema({
   steps:{
      type: [[Object]]
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
   collection: 'flows',
   timestamps: true
})

module.exports = mongoose.model('Flow', Flow)