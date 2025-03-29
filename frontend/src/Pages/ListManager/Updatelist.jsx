// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";

// const UpdateItem = () => {
//   const [item, setItem] = useState({ name: "", qty: "" });
//   const { id } = useParams(); // Get the item ID from the URL
//   const history = useNavigate();

//   useEffect(() => {
//     fetchItem();
//   }, [id]);

//   const fetchItem = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/app/list/${id}`);
//       console.log(response.data);  // Log the response to inspect the structure
//       setItem(response.data.item); // Correct the state mapping based on response structure
//     } catch (error) {
//       toast.error("Failed to fetch item details");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.put(`http://localhost:5000/app/list/${id}`, {
//         qty: item.qty // Only update quantity
//       });
//       toast.success("Item updated successfully");
//       history("/viewgrocerylist");
//     } catch (error) {
//       toast.error("Failed to update item");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
//           <h2 className="text-3xl font-bold text-white">Update Grocery Item</h2>
//           <p className="text-blue-100 mt-1">Edit the details of the grocery item</p>
//         </div>

//         <div className="p-8">
//           <div className="mb-4">
//             <label className="block text-gray-700">Item Name</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"  // Tailwind CSS classes for disabled style
//               value={item.name}  // Display the name
//               disabled  // Disable the input field
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Quantity</label>
//             <input
//               type="number"
//               className="w-full p-2 border border-gray-300 rounded-lg"
//               value={item.qty}
//               onChange={(e) => setItem({ ...item, qty: e.target.value })}
//             />
//           </div>
//           <div className="flex justify-end">
//             <button
//               onClick={handleUpdate}


//               className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer"
//             >
//               Update
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateItem;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const UpdateItem = () => {
  const [item, setItem] = useState({ name: "", qty: "" });
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/app/list/${id}`);
      setItem(response.data.item);
    } catch (error) {
      toast.error("Failed to fetch item details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/app/list/${id}`, {
        qty: item.qty
      });
      toast.success("Item updated successfully");
      navigate("/viewgrocerylist");
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleCancel = () => {
    navigate("/viewgrocerylist");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Update Grocery Item</h2>
          <p className="text-blue-100 mt-2 text-sm md:text-base">Modify the quantity of your grocery item</p>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center items-center h-40">
            <div className="animate-pulse text-indigo-500">Loading item details...</div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Item Name</label>
              <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {item.name}
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={item.qty}
                onChange={(e) => setItem({ ...item, qty: e.target.value })}
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                Update Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateItem;