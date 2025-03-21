import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../../Component/Nav";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "react-toastify/dist/ReactToastify.css";

const ViewList = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/list");
      setItems(response.data.items || response.data);

      if (!isFetched) {
        toast.success("Items fetched successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsFetched(true);
      }
    } catch (error) {
      toast.error("Failed to fetch items", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpdateItem = (itemId) => {
    history(`/update-item/${itemId}`);
    toast.info("Redirecting to update item...", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/list/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));

      toast.success("Item deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to delete item", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm("Are you sure you want to delete all items?");
    if (!confirmDeleteAll) return;

    try {
      await axios.delete("http://localhost:5000/api/list");
      setItems([]);

      toast.warning("All items deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to delete all items", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Filtered items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Grocery List Report", 14, 20);
    doc.setFontSize(12);
    doc.text("Item Name", 14, 30);
    doc.text("Quantity", 140, 30);

    let yPosition = 40;

    filteredItems.forEach((item) => {
      doc.text(item.name, 14, yPosition);
      doc.text(item.qty.toString(), 140, yPosition);
      yPosition += 10;
    });

    doc.save("grocery_list_report.pdf");

    toast.success("PDF report generated successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white">Grocery List</h2>
          <p className="text-blue-100 mt-1">View and manage your grocery items</p>
        </div>

        <div className="p-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-md w-full"
            />
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-600">No items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 text-md">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">ITEM NUMBER</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all">
                      <td className="px-6 py-4 text-center text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.name}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{item.qty}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleUpdateItem(item._id)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-1 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-1 px-4 rounded-lg hover:from-red-600 hover:to-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-center space-x-4">
            <button onClick={handleDeleteAll} className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">Delete List</button>
            <button onClick={generateReport} className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">Generate PDF</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewList;
