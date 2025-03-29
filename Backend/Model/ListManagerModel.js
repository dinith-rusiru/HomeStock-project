const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  Item_name: { type: String, required: true },
  qty: { type: Number, required: true }
});

const listManagerSchema = new mongoose.Schema({
  listName: { type: String, required: true },
  items: [itemSchema]
});

const List = mongoose.model("List", listManagerSchema);
module.exports = List;
