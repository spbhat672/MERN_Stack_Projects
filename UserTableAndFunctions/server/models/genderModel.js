const mongoose = require("mongoose");

const genderSchema = mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    },
}
);

const Genders = mongoose.model("Genders",genderSchema);

module.exports=Genders;