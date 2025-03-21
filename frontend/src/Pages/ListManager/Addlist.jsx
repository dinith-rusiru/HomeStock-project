import React, { useState } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addlist() {
  const history = useNavigate();
  const [items, setItems] = useState([
    { name: "", qty: "" }, // Initialize with one empty row
  ]);

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;

    // If name is 'name' field and the value contains numbers, prevent input
    if (name === "name" && /\d/.test(value)) {
      toast.error("Item name cannot contain numbers.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", qty: "" }]); // Add a new empty row
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index); // Remove the specific item row
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if any item has a duplicate name
    const itemNames = items.map(item => item.name.trim().toLowerCase());
    const duplicateItem = itemNames.some((name, index) => itemNames.indexOf(name) !== index);
  
    if (duplicateItem) {
      toast.error("Duplicate item names are not allowed!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    await sendRequest();
  };
  

  const sendRequest = async () => {
    try {
      // Send the request to add items
      await axios.post("http://localhost:5000/app/list/", { items });
  
      // Show success toast
      toast.success("Items added to the list!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Navigate to the viewlist page after a short delay (to allow toast to be shown)
      setTimeout(() => {
        history("/viewgrocerylist"); // Navigate to the viewlist page
      }, 2000);
    } catch (error) {
      console.error("Error adding items:", error);
      toast.error("Failed to add items.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <ToastContainer /> {/* Notification Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <h2 className="text-4xl font-bold text-white">Add New List</h2>
            <p className="text-blue-100 mt-2 text-lg">
              Enter the details of your new list
            </p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {items.map((item, index) => (
                <div key={index} className="flex space-x-4 items-center">
                  {/* Item Name Input */}
                  <div className="flex-1">
                    <label
                      htmlFor={`name-${index}`}
                      className="text-base font-medium text-gray-700 block mb-2"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      name="name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                      placeholder="Enter item name"
                      required
                    />
                  </div>

                  {/* Item Quantity Input */}
                  <div className="flex-1">
                    <label
                      htmlFor={`qty-${index}`}
                      className="text-base font-medium text-gray-700 block mb-2"
                    >
                      Quantity
                    </label>
                    <input
                      type="number"
                      id={`qty-${index}`}
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, e)}
                      className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                      placeholder="Enter quantity"
                      required
                      min="1"
                    />
                  </div>

                  {/* Remove button for each item row with colorful styling */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="w-20 bg-gradient-to-r from-red-600 to-pink-700 text-white font-medium py-4 px-6 rounded-lg hover:from-red-700 hover:to-pink-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-700 text-white font-medium py-4 px-6 rounded-lg hover:from-green-700 hover:to-teal-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-1 text-lg cursor-pointer"
                >
                  Add Another Item
                </button>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-1 text-lg cursor-pointer"
                >
                  Add List
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addlist;
