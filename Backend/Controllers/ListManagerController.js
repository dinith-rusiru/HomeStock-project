const List = require("../Model/ListManagerModel");
const mongoose = require("mongoose");

// ✅ Get All Items (with optional quantity filter)
const getAllItems = async (req, res) => {
  try {
    let items;
    if (req.query.quantity) {
      const quantityLimit = parseInt(req.query.quantity);
      items = await List.find({ qty: { $lte: quantityLimit } });
    } else {
      items = await List.find(); // Return all items if no filter is applied
    }

    if (!items.length) {
      return res.status(404).json({ message: "No items found" });
    }

    return res.status(200).json({ items });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Item by ID
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const item = await List.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.error("❌ Error fetching item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Add Multiple Items
const addList = async (req, res) => {
  try {
    const { items } = req.body; // Extract items array from request body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid request format or empty array" });
    }

    const savedItems = await List.insertMany(items); // Insert multiple items
    res.status(201).json({ message: "Items added successfully", items: savedItems });
  } catch (error) {
    console.error("❌ Error adding items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Item
const updateList = async (req, res) => {
  const { id } = req.params;
  const { Item_name, qty } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedItem = await List.findByIdAndUpdate(
      id,
      { Item_name, qty },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete Item
const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedItem = await List.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete List
const handleDeleteList = async () => {
  try {
    // Send DELETE request to delete all items
    await axios.delete("http://localhost:5000/app/list");

    // Show success message
    toast.success("All items deleted successfully");

    // Clear the items from the UI
    setItems([]);
  } catch (error) {
    toast.error("Failed to delete all items");
  }
};

// ✅ Delete All Items (Delete all items in the list)
const deleteAllItems = async (req, res) => {
  try {
    // Delete all items
    await List.deleteMany({});

    return res.status(200).json({ message: "All items deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting all items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { getAllItems, getById, addList, updateList, deleteList,deleteAllItems };
