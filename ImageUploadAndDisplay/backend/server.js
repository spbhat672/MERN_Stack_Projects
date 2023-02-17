const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const {bgCyan} = require("colors");
require("colors");
const connectDB = require("./config/config");

//dotenv config
dotenv.config();

//db config
connectDB();

//rest object
const app = express();


//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }))
app.use(express.json());

//routes
app.use("/api/images",require("./routes/imageRoutes"));

//port
const PORT = process.env.PORT || 8080


//listen
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`.bgCyan.white);
})