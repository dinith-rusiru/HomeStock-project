import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Nav from "../../Component/Nav";
import jsPDF from "jspdf"; // Import jsPDF

const ViewList = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/list");
        setLists(response.data.lists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, []);

  const handleDeleteList = async (id) => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await axios.delete(`http://localhost:5000/api/list/${id}`);
        setLists(lists.filter((list) => list._id !== id));
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }
  };

  const generatePDF = (list) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(list.listName, 20, 20); // Add list name at the top of the PDF

    let yOffset = 30;
    doc.setFontSize(12);
    list.items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name} - Quantity: ${item.quantity}`, 20, yOffset);
      yOffset += 10;
    });

    doc.save(`${list.listName}.pdf`); // Save as PDF with list name as file name
  };

  // Filter lists based on search term
  const filteredLists = lists.filter((list) =>
    list.listName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-600">Loading lists...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Grocery Lists</h2>

        {/* Search Bar */}
        <div className="relative mb-4">
  <input
    type="text"
    placeholder="Search by list name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 rounded w-80 bg-gray-200 pl-10" // Add padding to the left for the icon
  />
  <i className="fas fa-search absolute left-3 top-2 text-gray-500"></i> {/* Font Awesome search icon */}
</div>


        {filteredLists.length === 0 ? (
          <p className="text-center text-gray-600">No lists found matching your search. Add a new one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => (
              <div key={list._id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-700">{list.listName}</h3>
                <p className="text-gray-600">Items: {list.items.length}</p>

                <div className="mt-4 flex justify-between">
                  <Link to={`/list/${list._id}`} className="bg-blue-500 text-white px-4 py-2 rounded">
                    View List
                  </Link>
                  <button
                    onClick={() => handleDeleteList(list._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete List
                  </button>
                  <button
                    onClick={() => generatePDF(list)} // Add this button to generate PDF
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Generate PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewList;
