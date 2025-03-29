const List = require("../Model/ListManagerModel");
const mongoose = require("mongoose");

// ✅ Get All Lists
const getAllLists = async (req, res) => {
  try {
    const lists = await List.find();
    if (!lists.length) return res.status(404).json({ message: "No lists found" });

    return res.status(200).json({ lists });
  } catch (error) {
    console.error("❌ Error fetching lists:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get List by ID
const getListById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID format" });

    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: "List not found" });

    return res.status(200).json({ list });
  } catch (error) {
    console.error("❌ Error fetching list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Add New List with Items
const addList = async (req, res) => {
  try {
    const { listName, items } = req.body;

    if (!listName || !Array.isArray(items) || items.some(item => !item.Item_name || !item.qty)) {
      return res.status(400).json({ message: "Invalid request format: Each item must have 'Item_name' and 'qty'" });
    }

    const newList = new List({ listName, items });
    const savedList = await newList.save();

    return res.status(201).json({ message: "List added successfully", list: savedList });
  } catch (error) {
    console.error("❌ Error adding list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Add Item to a Specific List
const addItemToList = async (req, res) => {
  const { id } = req.params;
  const { Item_name, qty } = req.body;

  if (!Item_name || !qty) {
    return res.status(400).json({ message: "Item_name and qty are required" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID format" });

    const updatedList = await List.findByIdAndUpdate(
      id,
      { $push: { items: { Item_name, qty } } },
      { new: true }
    );

    if (!updatedList) return res.status(404).json({ message: "List not found" });

    return res.status(200).json({ message: "Item added successfully", list: updatedList });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Update Item in a List
const updateItemInList = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { Item_name, qty } = req.body;

    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.Item_name = Item_name;
    item.qty = qty;

    await list.save();

    return res.status(200).json({ message: "Item updated successfully", updatedItem: item });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};



// ✅ Delete Item from a List
const deleteItemFromList = async (req, res) => {
  const { listId, itemId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(listId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    if (!updatedList) return res.status(404).json({ message: "List or item not found" });

    return res.status(200).json({ message: "Item deleted successfully", list: updatedList });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Delete Entire List
const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID format" });

    const deletedList = await List.findByIdAndDelete(id);
    if (!deletedList) return res.status(404).json({ message: "List not found" });

    return res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete All Lists
const deleteAllLists = async (req, res) => {
  try {
    await List.deleteMany({});
    return res.status(200).json({ message: "All lists deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting all lists:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllLists,
  getListById,
  addList,
  addItemToList,
  updateItemInList,
  deleteItemFromList,
  deleteList,
  deleteAllLists
};
