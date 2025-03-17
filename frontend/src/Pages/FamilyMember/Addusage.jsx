// import React, { useState, useEffect } from "react";
// import Nav from "../../Component/Nav";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Addusage() {
//   const history = useNavigate();
//   const [inputs, setInputs] = useState({
//     name: "",
//     qty: "",
//     category: "",
//     usagedate: "",
//     notes: "",
//   });

//   // Fetch items for dropdown
//   const [items, setItems] = useState([]);
//   // Track the selected item's data
//   const [selectedItem, setSelectedItem] = useState(null);
//   // Track form errors
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         // Using the same endpoint as in your Itemtable component
//         const response = await axios.get("http://localhost:5000/gshoppers");
//         console.log("API Response:", response.data);
//         // Access gshoppers array from the response data
//         setItems(response.data.gshoppers || []);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     };
//     fetchItems();
//   }, []);

//   // Update selected item when name changes
//   useEffect(() => {
//     if (inputs.name) {
//       const item = items.find(item => item.name === inputs.name);
//       if (item) {
//         setSelectedItem(item);
//         // Auto-fill category from the selected item
//         setInputs(prev => ({
//           ...prev,
//           category: item.category
//         }));
//       }
//     }
//   }, [inputs.name, items]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Clear errors when field is changed
//     setErrors(prev => ({...prev, [name]: ""}));
    
//     setInputs((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Check if quantity is valid
//     if (selectedItem && (Number(inputs.qty) <= 0)) {
//       newErrors.qty = "Quantity must be greater than 0";
//     }
    
//     if (selectedItem && (Number(inputs.qty) > selectedItem.qty)) {
//       newErrors.qty = `Maximum available quantity is ${selectedItem.qty}`;
//     }
    
//     if (!inputs.name) {
//       newErrors.name = "Please select an item";
//     }
    
//     if (!inputs.usagedate) {
//       newErrors.usagedate = "Please select a date";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form before submission
//     if (!validateForm()) {
//       return;
//     }
    
//     try {
//       // First record the usage - using the same endpoint as your items
//       await sendUsageRequest();
      
//       // Then update the item quantity in inventory
//       if (selectedItem) {
//         await updateItemQuantity();
//       }
      
//       // Redirect to usage table
//       history("/usagetable");
//     } catch (error) {
//       console.error("Error submitting usage:", error);
//     }
//   };

//   // Send usage data to backend
//   const sendUsageRequest = async () => {
//     // Using the same endpoint for usage records
//     return await axios.post("http://localhost:5000/gshoppers", {
//       name: String(inputs.name),
//       qty: Number(inputs.qty),
//       category: String(inputs.category),
//       usagedate: String(inputs.usagedate),
//       notes: String(inputs.notes),
//       // Add these fields with default values if required by your backend
//       importantlevel: 1,
//       expdate: new Date().toISOString().split('T')[0],
//     });
//   };

//   // Update item quantity in inventory
//   const updateItemQuantity = async () => {
//     if (!selectedItem) return;
    
//     const updatedQty = selectedItem.qty - Number(inputs.qty);
    
//     return await axios.put(`http://localhost:5000/gshoppers/${selectedItem._id}`, {
//       name: selectedItem.name,
//       qty: updatedQty,
//       category: selectedItem.category,
//       importantlevel: selectedItem.importantlevel || 1,
//       expdate: selectedItem.expdate || new Date().toISOString().split('T')[0],
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Nav />
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//             <h2 className="text-3xl font-bold text-white">Add Usage</h2>
//             <p className="text-blue-100 mt-1">Enter the details of item usage</p>
//           </div>
//           <div className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Item Name Dropdown */}
//               <div>
//                 <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
//                   Item Name
//                 </label>
//                 <select
//                   id="name"
//                   name="name"
//                   value={inputs.name}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white`}
//                   required
//                 >
//                   <option value="">Select an item</option>
//                   {items.length > 0 ? (
//                     items.map((item) => (
//                       <option key={item._id} value={item.name}>
//                         {item.name} (Available: {item.qty})
//                       </option>
//                     ))
//                   ) : (
//                     <option disabled>Loading items...</option>
//                   )}
//                 </select>
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//               </div>

//               {/* Quantity */}
//               <div>
//                 <label htmlFor="qty" className="text-sm font-medium text-gray-700 block mb-2">
//                   Quantity Used
//                 </label>
//                 <input
//                   type="number"
//                   id="qty"
//                   name="qty"
//                   value={inputs.qty}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.qty ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
//                   placeholder="Enter quantity"
//                   required
//                   min="1"
//                   max={selectedItem ? selectedItem.qty : ""}
//                 />
//                 {errors.qty && <p className="text-red-500 text-sm mt-1">{errors.qty}</p>}
//                 {selectedItem && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     Available: {selectedItem.qty}
//                   </p>
//                 )}
//               </div>

//               {/* Category - Auto-filled from selected item */}
//               <div>
//                 <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-2">
//                   Category
//                 </label>
//                 <input
//                   type="text"
//                   id="category"
//                   name="category"
//                   value={inputs.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-100"
//                   placeholder="Category will be auto-filled"
//                   readOnly
//                 />
//               </div>

//               {/* Usage Date */}
//               <div>
//                 <label htmlFor="usagedate" className="text-sm font-medium text-gray-700 block mb-2">
//                   Usage Date
//                 </label>
//                 <input
//                   type="date"
//                   id="usagedate"
//                   name="usagedate"
//                   value={inputs.usagedate}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.usagedate ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
//                   required
//                 />
//                 {errors.usagedate && <p className="text-red-500 text-sm mt-1">{errors.usagedate}</p>}
//               </div>

//               {/* Notes */}
//               <div>
//                 <label htmlFor="notes" className="text-sm font-medium text-gray-700 block mb-2">
//                   Notes
//                 </label>
//                 <textarea
//                   id="notes"
//                   name="notes"
//                   value={inputs.notes}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                   placeholder="Enter any notes"
//                 ></textarea>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
//                 >
//                   Record Usage
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Addusage;


import React, { useState, useEffect } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      
      // Redirect to usage table
      history("/usagetable");
    } catch (error) {
      console.error("Error submitting usage:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Add Usage</h2>
            <p className="text-blue-100 mt-1">Enter the details of item usage</p>
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

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
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