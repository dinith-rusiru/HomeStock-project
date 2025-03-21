import React, { useState, useEffect } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Addusage() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    qty: "",
    category: "",
    usagedate: "",
    notes: "",
  });

  // Fetch items for dropdown
  const [items, setItems] = useState([]);
  // Track the selected item's data
  const [selectedItem, setSelectedItem] = useState(null);
  // Track form errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch inventory items from GshopperModel
        const response = await axios.get("http://localhost:5000/gshoppers");
        console.log("API Response:", response.data);
        // Access gshoppers array from the response data
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
    
    // Check if quantity exceeds available amount
    if (name === "qty" && selectedItem && Number(value) > selectedItem.qty) {
      toast.error(`Quantity exceeds available amount (${selectedItem.qty})`);
    }
    
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check if quantity is valid
    if (selectedItem && (Number(inputs.qty) <= 0)) {
      newErrors.qty = "Quantity must be greater than 0";
    }
    
    if (selectedItem && (Number(inputs.qty) > selectedItem.qty)) {
      newErrors.qty = `Maximum available quantity is ${selectedItem.qty}`;
    }
    
    if (!inputs.name) {
      newErrors.name = "Please select an item";
    }
    
    if (!inputs.usagedate) {
      newErrors.usagedate = "Please select a date";
    } else {
      // Get today's date (without time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get one month ago
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      // Convert input date to Date object
      const selectedDate = new Date(inputs.usagedate);
      selectedDate.setHours(0, 0, 0, 0);
      
      // Check if date is in the future
      if (selectedDate > today) {
        newErrors.usagedate = "Usage date cannot be in the future";
      }
      
      // Check if date is older than one month
      if (selectedDate < oneMonthAgo) {
        newErrors.usagedate = "Usage date cannot be more than one month in the past";
      }
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
      // First record the usage in FmemberModel
      await sendUsageRequest();
      
      // Then update the item quantity in inventory (GshopperModel)
      if (selectedItem) {
        await updateItemQuantity();
      }
      
      // Show success toast
      toast.success("Usage recorded successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
      // Redirect to usage table after a short delay
      setTimeout(() => {
        history("/usagetable");
      }, 2000);
    } catch (error) {
      console.error("Error submitting usage:", error);
      toast.error("Failed to record usage.");
    }
  };

  // Send usage data to FmemberModel endpoint
  const sendUsageRequest = async () => {
    return await axios.post("http://localhost:5000/fmembers", {
      name: String(inputs.name),
      qty: Number(inputs.qty),
      category: String(inputs.category),
      usagedate: String(inputs.usagedate),
      notes: String(inputs.notes),
    });
  };

  // Update item quantity in GshopperModel
  const updateItemQuantity = async () => {
    if (!selectedItem) return;
    
    const updatedQty = selectedItem.qty - Number(inputs.qty);
    
    return await axios.put(`http://localhost:5000/gshoppers/${selectedItem._id}`, {
      name: selectedItem.name,
      qty: updatedQty,
      category: selectedItem.category,
      importantlevel: selectedItem.importantlevel || 1,
      expdate: selectedItem.expdate || new Date().toISOString().split('T')[0],
    });
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const todayFormatted = new Date().toISOString().split('T')[0];

  // Calculate one month ago date in YYYY-MM-DD format for min attribute
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoFormatted = oneMonthAgo.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <ToastContainer />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <h2 className="text-4xl font-bold text-white">Add Usage</h2>
            <p className="text-blue-100 mt-2 text-lg">Enter the details of item usage</p>
          </div>
          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Item Name Dropdown */}
              <div>
                <label htmlFor="name" className="text-base font-medium text-gray-700 block mb-2">
                  Item Name
                </label>
                <div className="relative">
                  <select
                    id="name"
                    name="name"
                    value={inputs.name}
                    onChange={handleChange}
                    className={`appearance-none w-full px-5 py-4 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm pr-10`}
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quantity */}
                <div>
                  <label htmlFor="qty" className="text-base font-medium text-gray-700 block mb-2">
                    Quantity Used
                  </label>
                  <input
                    type="number"
                    id="qty"
                    name="qty"
                    value={inputs.qty}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-lg border ${errors.qty ? 'border-red-500' : 'border-gray-300'} focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm`}
                    placeholder="Enter quantity"
                    required
                    min="1"
                    max={selectedItem ? selectedItem.qty : ""}
                  />
                  {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
                  {selectedItem && (
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {selectedItem.qty}
                    </p>
                  )}
                </div>

                {/* Category - Auto-filled from selected item */}
                <div>
                  <label htmlFor="category" className="text-base font-medium text-gray-700 block mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={inputs.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-100 shadow-sm"
                    placeholder="Category will be auto-filled"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Usage Date */}
                <div>
                  <label htmlFor="usagedate" className="text-base font-medium text-gray-700 block mb-2">
                    Usage Date
                  </label>
                  <input
                    type="date"
                    id="usagedate"
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

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="text-base font-medium text-gray-700 block mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={inputs.notes}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    placeholder="Enter any notes"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button type="submit"
                        className="w-full text-white font-medium py-4 px-6 rounded-lg focus:outline-none focus:ring-3 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-1 text-lg"
                        style={{
                          background: "radial-gradient(circle, rgba(86,27,246,1) 0%, rgba(65,149,244,1) 100%)"
                        }}
                >
                  Record Usage
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Addusage;