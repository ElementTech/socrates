const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Parameter = new Schema({
   key: {
      type: String, unique: true
   },
   value: {
      type: String
   },
   secret: {
      type: Boolean
   }
}, {
   collection: 'parameters'
})

module.exports = mongoose.model('Parameter', Parameter)