const mongoose = require('mongoose');
const User = new mongoose.Schema({
    username: {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required :true
    },
    avatar : {
        type:String,
        default : null
    },
    about : {
        type : String,
    },
    savesPins : {
        type : Array,
        default : []
    }
})

User.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', User);