const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    file:{
        type:String,
        required:true
    }
});

const Image = mongoose.model("Image",imageSchema);

module.exports=Image;