// //taking data from the backend

import React, { useEffect, useState, useRef } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import Itemtabledetails from "./Itemtabledetails";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/gshoppers";

function Itemtable() {
  const [gshoppers, setGshoppers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();

  const fetchHandler = async () => {
    try {
      const response = await axios.get(URL);
      setGshoppers(response.data.gshoppers);
      setFilteredItems(response.data.gshoppers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  // Search Function
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredItems(gshoppers);
      setNoResults(false);
      return;
    }

    const filtered = gshoppers.filter((gshopper) =>
      gshopper.name.toLowerCase().startsWith(query)
    );

    setFilteredItems(filtered);
    setNoResults(filtered.length === 0);
  };

  // // Print Function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Add title with style
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Item Table Report", 14, 20);
  
    // Add space after the title
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
  
    // Table header with style
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const tableHeader = [[
      "Name", "Quantity", "Category", "Important Level", "Expiry Date"
    ]];
    
    // Table data
    const tableData = filteredItems.map((gshopper) => [
      
      gshopper.name,
      // gshopper.quantity,
      gshopper.qty || "N/A",
      gshopper.category,
      // gshopper.importantLevel,
      gshopper.importantlevel || "N/A",
      // gshopper.expiryDate,
      gshopper.expdate ? new Date(gshopper.expdate).toISOString().split("T")[0] : "N/A",
    ]); 
  
    // Add table
    autoTable(doc, {
      startY: 40,
      head: tableHeader,
      body: tableData,
      theme: 'grid', // Add grid theme
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, // Header background color
      bodyStyles: { fillColor: [240, 240, 240] }, // Body row background color
      styles: { fontSize: 10, cellPadding: 3, halign: "center" },
    });
  
    // Save the generated PDF
    doc.save("ItemTable_Report.pdf");
  };
  

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Item Table</h2>
            <p className="text-blue-100 mt-1">View and manage your items</p>
          </div>

          <div className="p-8" ref={componentRef}>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                value={searchQuery}
                onChange={handleSearch}
                type="text"
                name="search"
                placeholder="Search"
                className="w-75 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {noResults ? (
              <div className="text-center text-gray-600">
                <p>No grocery shoppers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-md">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Important Level
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((gshopper, i) => (
                      <Itemtabledetails
                        key={i}
                        gshopper={gshopper}
                        refreshData={fetchHandler}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4 mt-6">

              <button
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                onClick={handleDownloadPDF}             
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemtable;
