import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const UpdateItem = () => {   
  const [item, setItem] = useState({ name: "", qty: "" });
  const { id } = useParams(); // Get the item ID from the URL
  const history = useNavigate();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/list/${listId}/item/${id}`);
      setItem(response.data); // Ensure response structure matches
    } catch (error) {
      toast.error("Failed to fetch item details");
    }
  };
  

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/list/${listId}/item/${id}`, {
        qty: item.qty, // Only update quantity
      });
      toast.success("Item updated successfully");
      history(`/viewgrocerylist`);
    } catch (error) {
      toast.error("Failed to update item");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white">Update Grocery Item</h2>
          <p className="text-blue-100 mt-1">Edit the details of the grocery item</p>
        </div>

        <div className="p-8">
          <div className="mb-4">
            <label className="block text-gray-700">Item Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" // Disabled style
              value={item.name} // Display the name
              disabled // Disable the input field
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={item.qty}
              onChange={(e) => setItem({ ...item, qty: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
