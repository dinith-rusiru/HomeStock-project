// import React, { useState } from "react";
// import Nav from "../../Component/Nav";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Additem() {
//   const history = useNavigate();
//   const [inputs, setInputs] = useState({
//     name: "",
//     qty: "",
//     category: "",
//     importantlevel: "",
//     expdate: "",
//   });

//   //item categories
//   const categories = [
//     "Kitchen Items",
//     "Home Essentials",
//     "Foods",
//     "Electronics",
//     "Cleaning Supplies",
//     "Personal Care",
//     "Stationery",
//     "Beverages",
//   ];

//   const handleChange = (e) => {
//     setInputs((preState) => ({
//       ...preState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async(e)=>{
//     e.preventDefault();
//     console.log(inputs);
//     await sendRequest();
//       history('/itemtable');
//   };

//   const sendRequest= async()=>{
//     await axios.post("http://Localhost:5000/gshoppers",{
//       name: String(inputs.name),
//       qty: Number(inputs.qty),
//       category: String(inputs.category),
//       importantlevel: Number(inputs.importantlevel),
//       expdate: Date (inputs.expdate),
//     }).then(res => res.data);
//   }

//   return (
//     <div>
//       <Nav />
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input type="text" name="name" value={inputs.name} onChange={handleChange}/>
//         </div>

//         <div className="mb-3">
//           <label>Quantity:</label>
//           <input type="number" name="qty" value={inputs.qty} onChange={handleChange}/>
//         </div>

//         <div className="mb-3">
//           <label>Category:</label>
//           <select name="category" value={inputs.category} onChange={handleChange}>
//             <option value="">Select a category</option>
//             {categories.map((cat, index) => (
//               <option key={index} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Important Level:</label>
//           <select name="importantlevel" value={inputs.importantlevel} onChange={handleChange}>
//             <option value="">Select level (1-5)</option>
//             {[1, 2, 3, 4, 5].map((level) => (
//               <option key={level} value={level}>
//                 {level}
//               </option> 
//             ))}
//           </select>
//         </div>

//         <div>
//           <label>Expiration Date:</label>
//           <input type="date" name="expdate" value={inputs.expdate} onChange={handleChange}/>
//         </div>

//         <button type="submit">Add Item</button>
//       </form>
//     </div>
//   );
// }





// export default Additem;





// import React, { useState } from "react";
// import Nav from "../../Component/Nav";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Additem() {
//   const history = useNavigate();
//   const [inputs, setInputs] = useState({
//     name: "",
//     qty: "",
//     category: "",
//     importantlevel: "",
//     expdate: "",
//   });

//   // item categories
//   const categories = [
//     "Kitchen Items",
//     "Home Essentials",
//     "Foods",
//     "Electronics",
//     "Cleaning Supplies",
//     "Personal Care",
//     "Stationery",
//     "Beverages",
//   ];

//   const handleChange = (e) => {
//     setInputs((preState) => ({
//       ...preState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log(inputs);
//     await sendRequest();
//     history("/itemtable");
//   };

//   const sendRequest = async () => {
//     await axios
//       .post("http://Localhost:5000/gshoppers", {
//         name: String(inputs.name),
//         qty: Number(inputs.qty),
//         category: String(inputs.category),
//         importantlevel: Number(inputs.importantlevel),
//         expdate: Date(inputs.expdate),
//       })
//       .then((res) => res.data);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <Nav />
      
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//             <h2 className="text-3xl font-bold text-white">Add Item</h2>
//             <p className="text-blue-100 mt-1">Enter the details of your new item</p>
//           </div>
          
//           <div className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-2">
//                   Item Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={inputs.name}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                   placeholder="Enter item name"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="qty" className="text-sm font-medium text-gray-700 block mb-2">
//                     Quantity
//                   </label>
//                   <input
//                     type="number"
//                     id="qty"
//                     name="qty"
//                     value={inputs.qty}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                     placeholder="0"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="importantlevel" className="text-sm font-medium text-gray-700 block mb-2">
//                     Importance Level
//                   </label>
//                   <select
//                     id="importantlevel"
//                     name="importantlevel"
//                     value={inputs.importantlevel}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
//                     required
//                   >
//                     <option value="">Select priority (1-5)</option>
//                     {[1, 2, 3, 4, 5].map((level) => (
//                       <option key={level} value={level}>
//                         {level === 1 ? "1 - Low" : level === 5 ? "5 - High" : level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-2">
//                   Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="category"
//                     name="category"
//                     value={inputs.category}
//                     onChange={handleChange}
//                     className="appearance-none w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white pr-10"
//                     required
//                   >
//                     <option value="">Select a category</option>
//                     {categories.map((cat, index) => (
//                       <option key={index} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="expdate" className="text-sm font-medium text-gray-700 block mb-2">
//                   Expiration Date
//                 </label>
//                 <input
//                   type="date"
//                   id="expdate"
//                   name="expdate"
//                   value={inputs.expdate}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
//                 />
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
//                 >
//                   Add Item
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Additem;




import React, { useState } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Additem() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    qty: "",
    category: "",
    importantlevel: "",
    expdate: "",
  });

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

  const handleChange = (e) => {
    setInputs((preState) => ({
      ...preState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
  };

  const sendRequest = async () => {
    try {
      await axios.post("http://localhost:5000/gshoppers", {
        name: String(inputs.name),
        qty: Number(inputs.qty),
        category: String(inputs.category),
        importantlevel: Number(inputs.importantlevel),
        expdate: inputs.expdate,
      });
      
      // Show success notification
      toast.success("Item added to item table!", {
        position: "top-right",   // This sets the toast position to the top right
        autoClose: 2000, // Closes after 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after a delay
      // setTimeout(() => {        
      //   history("/itemtable");        // navigate to item table page after added to item table page
      // }, 2000);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <ToastContainer /> {/* Notification Container */}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <h2 className="text-4xl font-bold text-white">Add New Item</h2>
            <p className="text-blue-100 mt-2 text-lg">
              Enter the details of your new item
            </p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="text-base font-medium text-gray-700 block mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={inputs.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="qty" className="text-base font-medium text-gray-700 block mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="qty"
                    name="qty"
                    value={inputs.qty}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="importantlevel" className="text-base font-medium text-gray-700 block mb-2">
                    Importance Level
                  </label>
                  <select
                    id="importantlevel"
                    name="importantlevel"
                    value={inputs.importantlevel}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
                    required
                  >
                    <option value="">Select priority (1-5)</option>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>
                        {level === 1 ? "1 - Low" : level === 5 ? "5 - High" : level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="category" className="text-base font-medium text-gray-700 block mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={inputs.category}
                      onChange={handleChange}
                      className="appearance-none w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white pr-10 shadow-sm"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="expdate" className="text-base font-medium text-gray-700 block mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expdate"
                    name="expdate"
                    value={inputs.expdate}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-lg border border-gray-300 focus:ring-3 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-1 text-lg"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Additem;
