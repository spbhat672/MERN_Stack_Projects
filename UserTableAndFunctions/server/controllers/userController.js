const userModel = require('../models/userModel');

//get users
const getUserController=async(req,res)=>{
    try{
        const users = await userModel.find();
        res.status(200).send(users);
    }catch(err){
        console.log(err);
    }
};

//add users
const addUserController = async (req,res)=>{
   try{
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send("User created successfully");
   }catch(error){
    console.log(error);
    res.status(400).send("error:-"+ error);    
   }
}

//edit user
const editUserController = async (req,res) =>{
    try{        
        await userModel.findOneAndUpdate({_id:req.body._id},req.body);
        res.status(201).send("User Updated!");
    }catch(error){
        res.status(400).send(error);
        console.log(error);
    }
}

//delete user
const deleteUserController = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);
    await userModel.findOneAndDelete({ _id: _id });
    res.status(200).json("User Deleted");
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {getUserController,addUserController,editUserController,deleteUserController}