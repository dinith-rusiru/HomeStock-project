const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const gshopperRouter = require("./Routes/GshoopperRoutes");
const listManagerRouter = require("./Routes/ListManagerRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
app.use("/api/list", listManagerRouter);
app.use("/gshoppers", gshopperRouter);

// MongoDB Connection
const MONGO_URI = "mongodb+srv://admin:le7161C9pwmC89qo@cluster0.fpzv9.mongodb.net/";
//const MONGO_URI = "mongodb+srv://dularinisansala:Dulari123@cluster0.kntu1bq.mongodb.net/";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
