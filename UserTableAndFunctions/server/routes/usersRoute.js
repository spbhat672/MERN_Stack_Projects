const express = require('express');
const {getUserController,addUserController,editUserController,deleteUserController  } = require('./../controllers/userController');
const router = express.Router();

//routes
//Method - get
router.get('/get-user',getUserController);

//Method - post
router.post('/add-user',addUserController);

//Method - put
router.put('/edit-user',editUserController);

//method - POST
router.post("/delete-user", deleteUserController);

module.exports = router