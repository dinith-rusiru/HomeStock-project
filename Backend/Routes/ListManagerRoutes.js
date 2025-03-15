const express = require("express");
const router = express.Router();

//Insert Model 
const list = require("../Model/ListManagerModel");

//Insert GshopperController
const ListManagerController = require ("../Controllers/ListManagerController");

router.get("/",ListManagerController.getAllLists); //get using for display


//export
module.exports = router;