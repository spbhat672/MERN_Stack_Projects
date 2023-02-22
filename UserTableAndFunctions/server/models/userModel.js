const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    photocopy:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
},
  {timestamp:true}
);

const Users = mongoose.model("Users",userSchema);

module.exports=Users;