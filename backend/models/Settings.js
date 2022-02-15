const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Settings = new Schema({
   langs: {
      type: [Object] // {Python: {Default_Image: "latest","Run Command":"python"}}
   }
}, {
   collection: 'settings'
})

module.exports = mongoose.model('Settings', Settings)