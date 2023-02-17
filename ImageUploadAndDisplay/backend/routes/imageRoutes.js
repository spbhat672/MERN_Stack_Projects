const express = require('express');
const { getImageController,addImageController} = require('./../controllers/imageController');
const router = express.Router();

//routes
//Method - get
router.get('/get-image',getImageController);

//Method - post
router.post('/add-image',addImageController);

module.exports = router