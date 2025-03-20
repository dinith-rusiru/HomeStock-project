const express = require("express");
const mongoose= require("mongoose");
const router = require("./Routes/GshoopperRoutes")
const fmemberRoutes = require("../Backend/Routes/FmemberRoutes");
const userr = require("../Backend/Model/userModel");

const app = express();
const cors = require("cors");

//Middleware 
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend domain
    credentials: true,  // Allow credentials (cookies) to be sent
  }));
  app.use(express.json({ limit: '50mb' })); 
app.use("/gshoppers",router);
// CHANGE: Using the same router for usages instead of creating a new one
// app.use("/usages", router); // Same route handler for usage records
app.use("/fmembers", fmemberRoutes);
app.use("/api", userr);
mongoose.connect ("mongodb+srv://admin:le7161C9pwmC89qo@cluster0.fpzv9.mongodb.net/")
.then(()=>console.log("Connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=>console.log((err)));