const imageModel = require('../models/imageModel');

//get images
const getImageController=async(req,res)=>{
    try{
        const images = await imageModel.find();
        res.status(200).send(images);
    }catch(err){
        console.log(err);
    }
};

//add image
const addImageController = async (req,res)=>{
   try{
    const newImage = new imageModel(req.body);
    await newImage.save();
    res.status(201).send("Image added successfully");
   }catch(error){
    res.status(400).send("error",error);
    console.log(error);
   }
}

module.exports = {getImageController,addImageController}