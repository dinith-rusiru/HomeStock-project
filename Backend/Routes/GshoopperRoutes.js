const express = require("express");
const router = express.Router();

//Insert Model 
const Gshopper = require("../Model/GshopperModel");

//Insert GshopperController
const GshopperController = require ("../Controllers/GshopperController");

router.get("/",GshopperController.getAllGshoppers); //get using for display
router.post("/",GshopperController.addgshopper); //post using for insert
router.get("/:id",GshopperController.getById); 
router.put("/:id",GshopperController.updategshopper); //put using for insert
router.delete("/:id",GshopperController.deletegshopper); //delete using for delete

//export
module.exports = router;