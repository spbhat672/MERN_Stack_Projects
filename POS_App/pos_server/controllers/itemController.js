const itemModel = require('../models/itemModel');

//get items
const getItemController=async(req,res)=>{
    try{
        const items = await itemModel.find();
        res.status(200).send(items);
    }catch(err){
        console.log(err);
    }
};

//add items
const addItemController = async (req,res)=>{
   try{
    const newItem = new itemModel(req.body);
    await newItem.save();
    res.status(201).send("Item created successfully");
   }catch(error){
    res.status(400).send("error",error);
    console.log(error);
   }
}

//edit items
const editItemController = async (req,res) =>{
    try{        
        await itemModel.findOneAndUpdate({_id:req.body.itemId},req.body);
        res.status(201).send("Item Updated!");
    }catch(error){
        res.status(400).send(error);
        console.log(error);
    }
}

//delete items
const deleteItemController = async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log(itemId);
    await itemModel.findOneAndDelete({ _id: itemId });
    res.status(200).json("item Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {getItemController,addItemController,editItemController,deleteItemController}