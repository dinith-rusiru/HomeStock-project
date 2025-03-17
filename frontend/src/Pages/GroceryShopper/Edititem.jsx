import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../../Component/Nav";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // import toast styles

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

  // Fetch item data on component mount
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/gshoppers/${id}`);
        if (res.data.gshopper) {
          setInputs(res.data.gshopper);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);

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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === "qty") {
  //     const qtyValue = Number(value);
  //     if (qtyValue <= 0) {
  //       toast.error("Quantity must be greater than zero.");
  //       return;
  //     }
  //   }

  //   setInputs((preState) => ({
  //     ...preState,
  //     [name]: value,
  //   }));
  // };






 const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "qty") {
      const qtyValue = Number(value);
      if (qtyValue <= 0) {
        toast.error("Quantity must be greater than zero.");
        return;
      }
    }
  
    if (name === "expdate") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
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
        autoClose: 3000,
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
        autoClose: 3000,
      });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Add ToastContainer here */}
      <ToastContainer />

      {/* Your Nav component */}
      <Nav />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8">
            <h2 className="text-3xl font-bold text-white">Edit Item</h2>
            <p className="text-purple-100 mt-1">
              Update the details of your item
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

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
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
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
                  <select
                    id="importantlevel"
                    name="importantlevel"
                    value={inputs.importantlevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white"
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
                </div>
              </div>

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
                    className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-white pr-10"
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

              <div>
                <label
                  htmlFor="expdate"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Expiration Date
                </label>
                {/* <input
                  type="date"
                  id="expdate"
                  name="expdate"
                  value={inputs.expdate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                /> */}







<input
  type="date"
  id="expdate"
  name="expdate"
  value={inputs.expdate}
  onChange={handleChange}
  className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
  min={new Date().toISOString().split("T")[0]} // Prevents selecting past dates
  required
/>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-3 px-4 rounded-lg hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                >
                  Update Item
                </button>

                <Link to="/itemtable" className="flex-1">
                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition transform transition hover:-translate-y-0.5"
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

export default Edititem;
