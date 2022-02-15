const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Flow = new Schema({
   steps:{
      type: [[Object]]
   },
   name: {
      type: String
   },
   desc: {
      type: String
   }
}, {
   collection: 'flows'
})

module.exports = mongoose.model('Flow', Flow)