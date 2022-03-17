const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let DynamicParameter = new Schema({
   name: {
      type: String, unique: true
   },
   script:{
      type: String
   },
   lang:{
      type: String
   }
}, {
   collection: 'dynamics',
   timestamps: true
})

module.exports = mongoose.model('DynamicParameter', DynamicParameter)