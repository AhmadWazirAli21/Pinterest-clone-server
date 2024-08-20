const mongoose = require('mongoose');
const Comment = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pin",
  },
  content : {
    type : String,
    required : true
  },
  date : {
    type : Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment' , Comment)