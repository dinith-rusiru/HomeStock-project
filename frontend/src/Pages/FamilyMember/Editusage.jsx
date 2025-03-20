import React, { useState, useEffect } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditUsage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for form inputs
  const [inputs, setInputs] = useState({
    name: "",
    qty: "",
    category: "",
    usagedate: "",
    notes: "",
  });
  
  // Original data before edits to calculate quantity differences
  const [originalData, setOriginalData] = useState({
    name: "",
    qty: 0,
  });
  
  // State for inventory items
  const [items, setItems] = useState([]);
  
  // State for selected item
  const [selectedItem, setSelectedItem] = useState(null);
  
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Fetch the usage data to edit
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/fmembers/${id}`);
        if (res.data.fmember) {
          setInputs(res.data.fmember);
          setOriginalData({
            name: res.data.fmember.name,
            qty: res.data.fmember.qty,
          });
        }
      } catch (error) {
        console.error("Error fetching usage data:", error);
      }
    };
    fetchUsageData();
  }, [id]);

  // Fetch all inventory items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gshoppers");
        setItems(response.data.gshoppers || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  // Update selected item when name changes
  useEffect(() => {
    if (inputs.name) {
      const item = items.find(item => item.name === inputs.name);
      if (item) {
        setSelectedItem(item);
        // Auto-fill category from the selected item
        setInputs(prev => ({
          ...prev,
          category: item.category
        }));
      }
    }
  }, [inputs.name, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when field is changed
    setErrors(prev => ({...prev, [name]: ""}));
    
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!inputs.name) {
      newErrors.name = "Please select an item";
    }
    
    if (Number(inputs.qty) <= 0) {
      newErrors.qty = "Quantity must be greater than 0";
    }
    
    // Check if quantity is valid for the new item if item name changed
    if (inputs.name !== originalData.name) {
      const newItem = items.find(item => item.name === inputs.name);
      if (newItem && Number(inputs.qty) > newItem.qty) {
        newErrors.qty = `Maximum available quantity is ${newItem.qty}`;
      }
    } else {
      // If same item, check if the new quantity is greater than original + available
      const currentItem = items.find(item => item.name === inputs.name);
      if (currentItem) {
        const maxAvailable = currentItem.qty + Number(originalData.qty);
        if (Number(inputs.qty) > maxAvailable) {
          newErrors.qty = `Maximum available quantity is ${maxAvailable}`;
        }
      }
    }
    
    if (!inputs.usagedate) {
      newErrors.usagedate = "Please select a date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      // Update the usage record
      await updateUsageRecord();
      
      // Update inventory quantities
      await updateInventoryQuantities();
      
      // Redirect to usage table
      navigate("/usagetable");
    } catch (error) {
      console.error("Error updating usage:", error);
    }
  };

  // Update the usage record in FmemberModel
  const updateUsageRecord = async () => {
    return await axios.put(`http://localhost:5000/fmembers/${id}`, {
      name: String(inputs.name),
      qty: Number(inputs.qty),
      category: String(inputs.category),
      usagedate: String(inputs.usagedate),
      notes: String(inputs.notes),
    });
  };

  // Update inventory quantities based on changes
  const updateInventoryQuantities = async () => {
    // If the item name changed, we need to:
    // 1. Return the original quantity to the original item
    // 2. Take the new quantity from the new item
    if (inputs.name !== originalData.name) {
      // Find the original item to return quantity
      const originalItem = items.find(item => item.name === originalData.name);
      if (originalItem) {
        await axios.put(`http://localhost:5000/gshoppers/${originalItem._id}`, {
          name: originalItem.name,
          qty: originalItem.qty + Number(originalData.qty),
          category: originalItem.category,
          importantlevel: originalItem.importantlevel || 1,
          expdate: originalItem.expdate || new Date().toISOString().split('T')[0],
        });
      }
      
      // Find the new item to subtract quantity
      const newItem = items.find(item => item.name === inputs.name);
      if (newItem) {
        await axios.put(`http://localhost:5000/gshoppers/${newItem._id}`, {
          name: newItem.name,
          qty: newItem.qty - Number(inputs.qty),
          category: newItem.category,
          importantlevel: newItem.importantlevel || 1,
          expdate: newItem.expdate || new Date().toISOString().split('T')[0],
        });
      }
    } else {
      // If the item name is the same, we just need to adjust the quantity based on the difference
      const currentItem = items.find(item => item.name === inputs.name);
      if (currentItem) {
        const quantityDifference = Number(originalData.qty) - Number(inputs.qty);
        await axios.put(`http://localhost:5000/gshoppers/${currentItem._id}`, {
          name: currentItem.name,
          qty: currentItem.qty + quantityDifference,
          category: currentItem.category,
          importantlevel: currentItem.importantlevel || 1,
          expdate: currentItem.expdate || new Date().toISOString().split('T')[0],
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Edit Usage</h2>
            <p className="text-blue-100 mt-1">Update the details of item usage</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name Dropdown */}
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
                  Item Name
                </label>
                <select
                  id="name"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white`}
                  required
                >
                  <option value="">Select an item</option>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name} (Available: {item.qty})
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading items...</option>
                  )}
                </select>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="qty" className="text-sm font-medium text-gray-700 block mb-2">
                  Quantity Used
                </label>
                <input
                  type="number"
                  id="qty"
                  name="qty"
                  value={inputs.qty}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.qty ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  placeholder="Enter quantity"
                  required
                  min="1"
                />
                {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
                {selectedItem && (
                  <p className="text-sm text-gray-500 mt-1">
                    {inputs.name === originalData.name 
                      ? `Available: ${selectedItem.qty + Number(originalData.qty)}`
                      : `Available: ${selectedItem.qty}`}
                  </p>
                )}
              </div>

              {/* Category - Auto-filled from selected item */}
              <div>
                <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-2">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={inputs.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-100"
                  placeholder="Category will be auto-filled"
                  readOnly
                />
              </div>

              {/* Usage Date */}
              <div>
                <label htmlFor="usagedate" className="text-sm font-medium text-gray-700 block mb-2">
                  Usage Date
                </label>
                <input
                  type="date"
                  id="usagedate"
                  name="usagedate"
                  value={inputs.usagedate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.usagedate ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  required
                />
                {errors.usagedate && <p className="text-red-500 text-sm mt-1">{errors.usagedate}</p>}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="text-sm font-medium text-gray-700 block mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={inputs.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter any notes"
                ></textarea>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                >
                  Update Usage
                </button>
                
                <Link to="/usagetable" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUsage;