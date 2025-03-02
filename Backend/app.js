 const express = require("express");
const mongoose= require("mongoose");
const router = require("./Routes/GshoopperRoutes")

const app = express();
const cors = require("cors");

//Middleware 
app.use(express.json());
app.use(cors());
app.use("/gshoppers",router);

mongoose.connect ("mongodb+srv://admin:le7161C9pwmC89qo@cluster0.fpzv9.mongodb.net/")
.then(()=>console.log("Connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=>console.log((err)));