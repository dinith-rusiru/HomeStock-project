const express = require("express");
const mongoose= require("mongoose");
//const router = require("./Routes/GshoopperRoutes")
const router = require("./Routes/ListManagerRoutes")

const app = express();
const cors = require("cors");

//Middleware 
app.use(express.json());
app.use(cors());


app.use("/lists",router);

//mongoose.connect ("mongodb+srv://admin:le7161C9pwmC89qo@cluster0.fpzv9.mongodb.net/")
mongoose.connect ("mongodb+srv://admin:NieTuCwZPlz2Av6I@cluster0.r2x9s.mongodb.net/")
.then(()=>console.log("Connected to mongodb"))
.then(()=>{
    app.listen(5000);
})
.catch((err)=>console.log((err)));



//NieTuCwZPlz2Av6I mongodb password
