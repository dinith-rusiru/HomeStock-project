const express = require("express");
const {
  getAllLists,
  getListById,
  addList,
  addItemToList,
  updateItemInList,
  deleteItemFromList,
  deleteList,
  deleteAllLists
} = require("../Controllers/ListManagerController");

const router = express.Router();

// ✅ Get all lists
router.get("/", getAllLists);

// ✅ Get a specific list by ID
router.get("/:id", getListById);

// ✅ Add a new list with items
router.post("/", addList);

// ✅ Add an item to a specific list
router.put("/:id/items", addItemToList);

// ✅ Update an item in the list
// Modified this route to reflect the changes for updating item quantity and name
router.put("/:listId/items/:itemId", updateItemInList);

// ✅ Delete an item from the list
router.delete("/:listId/items/:itemId", deleteItemFromList);

// ✅ Delete the entire list
router.delete("/:id", deleteList);

// ✅ Delete all lists
router.delete("/", deleteAllLists);

module.exports = router;
