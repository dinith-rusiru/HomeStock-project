const express = require("express");
const mongoose= require("mongoose");
const router = require("./Routes/GshoopperRoutes")
const fmemberRoutes = require("../Backend/Routes/FmemberRoutes");

const app = express();
const cors = require("cors");

//Middleware 
app.use(express.json());
app.use(cors());
app.use("/gshoppers",router);
// CHANGE: Using the same router for usages instead of creating a new one
// app.use("/usages", router); // Same route handler for usage records
app.use("/fmembers", fmemberRoutes);

mongoose.connect ("mongodb+srv://admin:le7161C9pwmC89qo@cluster0.fpzv9.mongodb.net/")
.then(()=>console.log("Connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=>console.log((err)));