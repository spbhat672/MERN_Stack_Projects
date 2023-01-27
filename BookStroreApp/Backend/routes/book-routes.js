const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const booksController = require("../controllers/books-controller");

router.get("/",booksController.getAllBooks);
router.get("/:id",booksController.getById);
router.post("/",booksController.addBook);
router.put("/:id",booksController.updateBook);
router.delete("/:id",booksController.deleteBook);

module.exports=router;