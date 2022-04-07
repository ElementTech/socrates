const mongoose = require('mongoose');
const m2s = require('mongoose-to-swagger');
const swaggerSchema = m2s(require('../models/Block'));
console.log(swaggerSchema);