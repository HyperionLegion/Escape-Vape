let mongoose = require('mongoose');

// Log Schema
let LogSchema = mongoose.Schema({
  user_id:{
    type: String,
    required: true
  },
  logs:{
    type: [{date: Date, body: String}],
    required: true
  },
  date:{
    type: Date,
    default:Date.now,
    required:true
  }
});

let Log = module.exports = mongoose.model('Log', LogSchema);