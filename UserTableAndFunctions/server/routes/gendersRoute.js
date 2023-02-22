const express = require("express");
const {getGendersController} = require("./../controllers/genderController");

const router = express.Router();

//routes

//Method - GET
router.get("/get-gender", getGendersController);

module.exports = router;