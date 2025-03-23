import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Edititem() {
  const [inputs, setInputs] = useState({
    name: "",
    qty: "",
    category: "",
    importantlevel: "",
    expdate: "",
  });
  const history = useNavigate();
  const id = useParams().id;
  let formattedDate = null;

  // Fetch item data on component mount
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/gshoppers/${id}`);
        if (res.data.gshopper) {
          formattedDate = formatDateForInput(res.data.gshopper.expdate);
          setInputs({...res.data.gshopper, expdate:formattedDate});
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  console.log(inputs.expdate);
          
  // Send update request
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/gshoppers/${id}`, {
        name: String(inputs.name),
        qty: Number(inputs.qty),
        category: String(inputs.category),
        importantlevel: Number(inputs.importantlevel),
        expdate: String(inputs.expdate),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(value)

    if (name === "qty") {
      const qtyValue = Number(value);
      if (qtyValue <= 0) {
        toast.error("Quantity must be greater than zero.");
        return;
      }
    }

    if (name === "expdate") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        toast.error("Expiration date cannot be in the past.");
        return;
      }
    }
    setInputs((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest();
      toast.success("Item Updated!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate to item table after 2 seconds
      setTimeout(() => {
        history("/itemtable");
      }, 2000);
    } catch (error) {
      toast.error("Error updating item!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const formatDateForInput = (isoDate) => {
    return new Date(isoDate).toISOString().split("T")[0];
  };

  // Categories for select dropdown
  const categories = [
    "Kitchen Items",
    "Home Essentials",
    "Foods",
    "Electronics",
    "Cleaning Supplies",
    "Personal Care",
    "Stationery",
    "Beverages",
  ];

  // Get importance level badge color
  const getImportanceBadgeColor = (level) => {
    switch (level) {
      case '5':
      case 5:
        return "bg-red-100 text-red-800";
      case '4':
      case 4:
        return "bg-orange-100 text-orange-800";
      case '3':
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case '2':
      case 2:
        return "bg-green-100 text-green-800";
      case '1':
      case 1:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <ToastContainer />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Edit Item</h2>
            <p className="text-blue-100 mt-1">Update the details of your item</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  required
                />
              </div>

              {/* Quantity and Importance Level Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="qty"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="qty"
                    name="qty"
                    value={inputs.qty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    placeholder="Enter quantity"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="importantlevel"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Importance Level
                  </label>
                  <div className="relative">
                    <select
                      id="importantlevel"
                      name="importantlevel"
                      value={inputs.importantlevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm appearance-none pr-10 bg-white"
                      required
                    >
                      <option value="">Select level (1-5)</option>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level === 1
                            ? "1 - Low"
                            : level === 5
                            ? "5 - High"
                            : level}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Show the importance level badge */}
                  {inputs.importantlevel && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceBadgeColor(inputs.importantlevel)}`}>
                        {inputs.importantlevel === 1 || inputs.importantlevel === '1' ? 'Low' : 
                         inputs.importantlevel === 5 || inputs.importantlevel === '5' ? 'High' : 
                         `Level ${inputs.importantlevel}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={inputs.category}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm bg-white pr-10"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expiration Date Field */}
              <div>
                <label
                  htmlFor="expdate"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Expiration Date
                </label>
                <input
                  type="date"
                  id="expdate"
                  name="expdate"
                  value={inputs.expdate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                
                {/* Show expiry status if date is selected */}
                {inputs.expdate && (
                  <div className="mt-2">
                    {(() => {
                      const expiryDate = new Date(inputs.expdate);
                      const today = new Date();
                      const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                      
                      if (daysDiff < 0) {
                        return <span className="text-red-600 text-sm">Expired</span>;
                      } else if (daysDiff < 30) {
                        return <span className="text-orange-600 text-sm">Expiring soon ({daysDiff} days left)</span>;
                      } else {
                        return <span className="text-green-600 text-sm">Valid ({daysDiff} days until expiry)</span>;
                      }
                    })()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Update Item
                </button>

                <Link to="/itemtable" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
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

export default Edititem;