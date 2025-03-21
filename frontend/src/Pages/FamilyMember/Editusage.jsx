import React, { useState, useEffect } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditUsage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [inputs, setInputs] = useState({
    name: "",
    qty: "",
    category: "",
    usagedate: "",
    notes: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    qty: 0,
    category: "",
    usagedate: "",
    notes: "",
  });

  const [items, setItems] = useState([]);
  const [availableQty, setAvailableQty] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state && location.state.fmember) {
      const { name, qty, category, usagedate, notes } = location.state.fmember;
      setInputs({ name, qty, category, usagedate, notes });
      setOriginalData({ name, qty, category, usagedate, notes });
    } else {
      fetchUsageData();
    }
  }, [id]);

  const fetchUsageData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/fmembers/${id}`);
      if (res.data.fmember) {
        setInputs(res.data.fmember);
        setOriginalData(res.data.fmember);
      } else {
        toast.error("Usage data not found!");
      }
    } catch (error) {
      toast.error("Error loading usage data!");
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gshoppers");
        setItems(response.data.gshoppers || []);
      } catch (error) {
        toast.error("Error loading inventory items!");
      }
    };
    fetchItems();
  }, []);

  // Update available quantity when item name changes or when items are loaded
  useEffect(() => {
    if (inputs.name && items.length > 0) {
      const selectedItem = items.find(item => item.name === inputs.name);
      if (selectedItem) {
        // If editing the same item, add the original quantity to available
        if (originalData.name === inputs.name) {
          setAvailableQty(selectedItem.qty + Number(originalData.qty));
        } else {
          setAvailableQty(selectedItem.qty);
        }
      }
    }
  }, [inputs.name, items, originalData.name, originalData.qty]);

  const validateDate = (date) => {
    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get one month ago
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // Convert input date to Date object
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    // Check if date is in the future
    if (selectedDate > today) {
      return "Usage date cannot be in the future";
    }
    
    // Check if date is older than one month
    if (selectedDate < oneMonthAgo) {
      return "Usage date cannot be more than one month in the past";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date before submission
    const dateError = validateDate(inputs.usagedate);
    if (dateError) {
      setErrors({...errors, usagedate: dateError});
      toast.error(dateError);
      return;
    }

    // Final validation before submitting
    if (Number(inputs.qty) <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    // Check if new quantity exceeds available quantity
    if (inputs.name !== originalData.name) {
      const selectedItem = items.find(item => item.name === inputs.name);
      if (selectedItem && Number(inputs.qty) > selectedItem.qty) {
        toast.error(`Quantity exceeds available stock of ${selectedItem.qty}.`);
        return;
      }
    } else {
      // If same item, check if the new quantity is valid considering the original quantity
      const selectedItem = items.find(item => item.name === inputs.name);
      const maxAvailable = selectedItem ? (selectedItem.qty + Number(originalData.qty)) : 0;
      if (Number(inputs.qty) > maxAvailable) {
        toast.error(`Quantity exceeds available stock of ${maxAvailable}.`);
        return;
      }
    }

    try {
      // First, handle the original item if the name has changed
      if (originalData.name !== inputs.name) {
        // Return the original qty to the original item's inventory
        await updateItemInventory(originalData.name, originalData.qty, "add");
        
        // Deduct the new qty from the newly selected item's inventory
        await updateItemInventory(inputs.name, inputs.qty, "subtract");
      } else {
        // If same item, just handle the qty difference
        const qtyDifference = Number(originalData.qty) - Number(inputs.qty);
        if (qtyDifference !== 0) {
          // If positive, add back to inventory; if negative, subtract from inventory
          await updateItemInventory(inputs.name, Math.abs(qtyDifference), qtyDifference > 0 ? "add" : "subtract");
        }
      }

      // Update the usage record
      await axios.put(`http://localhost:5000/fmembers/${id}`, {
        name: inputs.name,
        qty: Number(inputs.qty),
        category: inputs.category,
        usagedate: inputs.usagedate,
        notes: inputs.notes,
      });

      toast.success("Usage Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate to usage table after 2 seconds
      setTimeout(() => {
        navigate("/usagetable");
      }, 2000);
    } catch (error) {
      toast.error("Failed to update usage!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const updateItemInventory = async (itemName, quantity, action) => {
    try {
      const response = await axios.get("http://localhost:5000/gshoppers");
      const existingItem = response.data.gshoppers.find((item) => item.name === itemName);

      if (existingItem) {
        // Calculate new quantity based on action (add or subtract)
        const newQty = action === "add" 
          ? existingItem.qty + Number(quantity)
          : existingItem.qty - Number(quantity);
        
        // Ensure quantity doesn't go negative
        const finalQty = Math.max(0, newQty);
        
        await axios.put(`http://localhost:5000/gshoppers/${existingItem._id}`, {
          name: existingItem.name,
          qty: finalQty,
          category: existingItem.category,
          importantlevel: existingItem.importantlevel,
          expdate: existingItem.expdate,
        });
      } else if (action === "add") {
        // Only create a new item if we're adding inventory
        // This is for the case where we need to add back qty to an item that might have been deleted
        const categoryToUse = inputs.category || "Uncategorized";
        await axios.post("http://localhost:5000/gshoppers", {
          name: itemName,
          qty: Number(quantity),
          category: categoryToUse,
          importantlevel: 3, // Default importance level
          expdate: new Date().toISOString().split("T")[0], // Today's date as default
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error("Error updating inventory!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when field is changed
    setErrors(prev => ({...prev, [name]: ""}));

    if (name === "qty") {
      const qtyValue = Number(value);
      
      // Validate quantity is greater than zero
      if (qtyValue <= 0) {
        toast.error("Quantity must be greater than zero.");
        return;
      }
      
      // Validate quantity doesn't exceed available stock
      if (qtyValue > availableQty) {
        toast.error(`Quantity exceeds available stock of ${availableQty}.`);
        // Still update the input but validation will prevent form submission
      }
    }

    // If changing the item name, update the category based on the selected item
    if (name === "name") {
      const selectedItem = items.find(item => item.name === value);
      if (selectedItem) {
        // Calculate available quantity considering original quantity if editing same item
        let newAvailableQty = selectedItem.qty;
        if (originalData.name === value) {
          newAvailableQty += Number(originalData.qty);
        }
        setAvailableQty(newAvailableQty);
        
        setInputs(prevState => ({
          ...prevState,
          [name]: value,
          category: selectedItem.category, // Update category when item changes
          // Reset quantity if it exceeds the available amount
          qty: Number(prevState.qty) > newAvailableQty ? "" : prevState.qty
        }));
        return;
      }
    }

    // Validate usage date when changed
    if (name === "usagedate") {
      const dateError = validateDate(value);
      if (dateError) {
        setErrors({...errors, usagedate: dateError});
        toast.error(dateError);
        // Still update the input but validation will prevent form submission
      }
    }

    setInputs(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const todayFormatted = new Date().toISOString().split('T')[0];

  // Calculate one month ago date in YYYY-MM-DD format for min attribute
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoFormatted = oneMonthAgo.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Nav Bar at the Top */}
      /////
      {/* Toast Container */}
      <ToastContainer />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8"
               style={{
                background: "linear-gradient(90deg, rgba(69,69,69,1) 0%, rgba(204,111,217,1) 35%, rgba(0,154,185,1) 100%)"
               }}
          >
            <h2 className="text-3xl font-bold text-white">Edit Usage</h2>
            <p className="text-purple-100 mt-1">Update the details of your usage record</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Item Name
                </label>
                <select
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white"
                  required
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name} (Available: {item.name === originalData.name ? item.qty + Number(originalData.qty) : item.qty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Quantity (Max Available: {availableQty})
                </label>
                <input
                  type="number"
                  name="qty"
                  value={inputs.qty}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  required
                  min="1"
                  max={availableQty}
                />
              </div>

              {/* Usage Date */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Usage Date
                </label>
                <input
                  type="date"
                  name="usagedate"
                  value={inputs.usagedate}
                  onChange={handleChange}
                  min={oneMonthAgoFormatted}
                  max={todayFormatted}
                  className={`w-full px-5 py-4 rounded-lg border ${errors.usagedate ? 'border-red-500' : 'border-gray-300'} focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm`}
                  required
                />
                {errors.usagedate && <p className="text-red-500 text-sm mt-1">{errors.usagedate}</p>}
                <p className="text-sm text-gray-500 mt-1">
                  Date must be between {oneMonthAgoFormatted} and {todayFormatted}
                </p>
              </div>

              {/* Notes Field */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={inputs.notes}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  rows="4"
                  placeholder="Enter any notes (optional)"
                ></textarea>
              </div>

              {/* Update & Cancel Buttons */}
              <div className="flex gap-4 pt-4">
                <button type="submit"
                        className="flex-1 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                        style={{
                          background: "linear-gradient(90deg, rgba(69,69,69,1) 0%, rgba(204,111,217,1) 35%, rgba(0,154,185,1) 100%)"
                        }}
                >
                  Update Usage
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/usagetable")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUsage;
