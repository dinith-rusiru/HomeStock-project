const express = require("express");
const router = express.Router();

//Insert Model
// const User = require("../Model/GshopperModel");
const User = require("../Model/FmemberModel");

//Insert User Controller
const FmemberControllers = require("../Controllers/FmemberControllers");

router.get("/",FmemberControllers.getAlllUsers);
router.post("/",FmemberControllers.addUsers);
router.get("/:id",FmemberControllers.getById);
router.put("/:id",FmemberControllers.updateUser);
router.delete("/:id",FmemberControllers.deleteUser);

//export
module.exports = router;