const mongoose = require("mongoose");
require("colors");

//connectDb Function
const connectDB = async()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected ${conn}`.bgYellow);
    }catch(err){
        console.log(`Error: ${err.message}`.bgRed);
        process.exit(1);
    }
}

//export
module.exports = connectDB;