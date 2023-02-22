const mongoose = require('mongoose');
const dotenv = require("dotenv");
const connectDb = require('./config/config');
const genderModel = require('./models/genderModel');
const gendersData = require('./utils/genderData');
require('colors');

//config
dotenv.config();
connectDb();

//function seeder
const importData = async ()=>{
    try{
        await genderModel.deleteMany();
        const genderData = await genderModel.insertMany(gendersData);
        console.log("All gender data added".bgGreen);
    }catch(error){
        console.log(`${error}`.bgRed.inverse);
        process.exit(1);
    }
}

importData();