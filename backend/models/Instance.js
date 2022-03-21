const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Instance = new Schema({
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
   desc: {
      type: String
   },
   block: {
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
   collection: 'instances',
   timestamps: true
})

module.exports = mongoose.model('Instance', Instance)