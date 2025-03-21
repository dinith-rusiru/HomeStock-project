const express = require("express");
const { getAllItems, addList, getById, updateList, deleteList, deleteAllItems } = require("../Controllers/ListManagerController");

const router = express.Router();

router.get("/", getAllItems); // Get all items
router.post("/", addList);     // Add items to the list
router.get("/:id", getById);   // Get an item by ID
router.put("/:id", updateList); // Update an item
router.delete("/:id", deleteList); // Delete an individual item

// Route to delete all items
router.delete("/", deleteAllItems); // Delete all items from the list

module.exports = router;
