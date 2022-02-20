const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let GithubElement = new Schema({
   path: {
      type: String
   },
   content: {
      type: String
   },
   prefix:{
      type: String
   },
   sha: {
      type: String
   }
}, {
   collection: 'github'
})

module.exports = mongoose.model('GithubElement', GithubElement)