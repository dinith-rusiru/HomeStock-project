import React, { useState } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addlist() {
  const history = useNavigate();
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([{ name: "", qty: "" }]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    if (name === "name" && /\d/.test(value)) {
      toast.error("Item name cannot contain numbers.", { autoClose: 2000 });
      return;
    }
    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", qty: "" }]);
    toast.info("New item field added.", { autoClose: 1000 });
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    toast.warn("Item removed.", { autoClose: 1000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listName.trim()) {
      toast.error("List name cannot be empty.", { autoClose: 2000 });
      return;
    }
    const itemNames = items.map((item) => item.name.trim().toLowerCase());
    const duplicateItem = itemNames.some((name, index) => itemNames.indexOf(name) !== index);
    if (duplicateItem) {
      toast.error("Duplicate item names are not allowed!", { autoClose: 2000 });
      return;
    }
    await sendRequest();
  };

  const sendRequest = async () => {
    try {
      const formattedItems = items.map((item) => ({
        Item_name: item.name,
        qty: Number(item.qty),
      }));
      const newList = {
        listName,
        items: formattedItems,
        type: "manual",  // Set the type of list as 'manual'
      };
      await axios.post("http://localhost:5000/api/list", newList);
      toast.success("List added successfully!", { autoClose: 2000 });
      setTimeout(() => history("/viewgrocerylist"), 2000);
    } catch (error) {
      console.error("Error adding list:", error);
      toast.error("Failed to add list. Please try again.", { autoClose: 2000 });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <ToastContainer />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <h2 className="text-4xl font-bold text-white">Add New List</h2>
          </div>
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-gray-700">List Name</label>
                <input type="text" value={listName} onChange={(e) => setListName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
              </div>
              {items.map((item, index) => (
                <div key={index} className="flex space-x-4 items-center">
                  <input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(index, e)} placeholder="Item Name" className="w-1/2 px-4 py-3 border rounded-lg" required />
                  <input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} placeholder="Quantity" className="w-1/3 px-4 py-3 border rounded-lg" required min="1" />
                  {index > 0 && <button type="button" onClick={() => handleRemoveItem(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg">Remove</button>}
                </div>
              ))}
              <button type="button" onClick={handleAddItem} className="bg-green-500 text-white px-6 py-3 rounded-lg w-full">Add Another Item</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full">Add List</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addlist;