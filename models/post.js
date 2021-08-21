let mongoose = require('mongoose');

// Log Schema
let PostSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  comments:{
    type: [{date: Date, body: String}],
    required: true
  },
  date:{
    type: Date,
    default:Date.now,
    required:true
  }
});

let Post = module.exports = mongoose.model('Post', PostSchema);