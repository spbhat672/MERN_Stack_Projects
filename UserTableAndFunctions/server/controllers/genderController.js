const gendersModel = require("../models/genderModel");

//get gender data
const getGendersController = async (req, res) => {
  try {
    const genders = await gendersModel.find();
    res.send(genders);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {getGendersController};