const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/book-routes");
const cors = require("cors");

const app = express();

//Middleware

app.use(express.json());
app.use(cors());
app.use("/books",router) // localhost:5000:/books

mongoose.connect("mongodb+srv://santoshbhat672:santu672@cluster0.mpbzuud.mongodb.net/?retryWrites=true&w=majority")
.then(()=> console.log("Connected to the database"))
.then(()=>{app.listen(5000);})
.catch((err)=> console.log(err));
