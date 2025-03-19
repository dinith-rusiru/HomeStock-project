// //taking data from the backend

import React, { useEffect, useState, useRef } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import Itemtabledetails from "../GroceryShopper/Itemtabledetails";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/gshoppers";

function Inventory() {
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
  const handleSearch = (e) => {     // search by the item name
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
  // const handleDownloadPDF = () => {
  //   const doc = new jsPDF();
  
  //   // Add title with style
  //   doc.setFontSize(18);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Item Table Report", 14, 20);
  
  //   // Add space after the title
  //   doc.setFontSize(12);
  //   doc.setFont("helvetica", "normal");
  //   doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
  
  //   // Table header with style
  //   doc.setFontSize(12);
  //   doc.setFont("helvetica", "bold");
  //   const tableHeader = [[
  //     "Name", "Quantity", "Category", "Important Level", "Expiry Date"
  //   ]];
    
  //   // Table data
  //   const tableData = filteredItems.map((gshopper) => [
      
  //     gshopper.name,
  //     gshopper.qty || "N/A",
  //     gshopper.category,
  //     gshopper.importantlevel || "N/A",
  //     gshopper.expdate ? new Date(gshopper.expdate).toISOString().split("T")[0] : "N/A",
  //   ]); 
  
  //   // Add table
  //   autoTable(doc, {
  //     startY: 40,
  //     head: tableHeader,
  //     body: tableData,
  //     theme: 'grid', // Add grid theme
  //     headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, // Header background color
  //     bodyStyles: { fillColor: [240, 240, 240] }, // Body row background color
  //     styles: { fontSize: 10, cellPadding: 3, halign: "center" },
  //   });
  
  //   // Save the generated PDF
  //   doc.save("ItemTable_Report.pdf");
  // };
  

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
      gshopper.qty || "N/A",
      gshopper.category,
      gshopper.importantlevel || "N/A",
      gshopper.expdate ? new Date(gshopper.expdate).toISOString().split("T")[0] : "N/A",
    ]);
    
    // Add table with enhanced styling
    autoTable(doc, {
      startY: 40,
      head: tableHeader,
      body: tableData,
      theme: 'striped',
      
      // Enhanced header styling
      headStyles: { 
        fillColor: [41, 128, 185],  // Vibrant blue color
        textColor: [255, 255, 255], 
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 5,
        lineWidth: 0.2,
      },
      
      // Body styling
      bodyStyles: { 
        fillColor: [245, 245, 245], // Light gray background
        textColor: [44, 62, 80],    // Dark navy text
        fontSize: 10, 
        cellPadding: 4,
        halign: "center" 
      },
      
      // Alternate row styling
      alternateRowStyles: {
        fillColor: [255, 255, 255], // White
      },
      
      // General styling
      styles: { 
        overflow: 'linebreak',
        cellWidth: 'auto',
        minCellHeight: 12,
        lineColor: [189, 195, 199], // Light gray border
        lineWidth: 0.1,
      },
      
      // Column-specific styling
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left' },     // Name column
        1: { halign: 'center' },                      // Quantity column
        2: { halign: 'center' },                      // Category column
        3: { halign: 'center', fontStyle: 'bold' },   // Importance column
        4: { halign: 'center' }                       // Date column
      },
      
      // Table border styling
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      tableLineWidth: 0.5,
      tableLineColor: [52, 152, 219], // Blue border around entire table
      
      // Custom cell rendering for important items
      willDrawCell: function(data) {
        // Add visual indicators based on cell content
        if (data.section === 'body') {
          const cell = data.cell;
          const colIndex = data.column.index;
          
          // Style importance levels
          if (colIndex === 3) { // Importance column
            const value = cell.text[0];
            if (value === 'High') {
              doc.setFillColor(255, 240, 240); // Light red background
              doc.setTextColor(220, 53, 69);   // Red text
            } else if (value === 'Medium') {
              doc.setFillColor(255, 252, 230); // Light yellow background  
              doc.setTextColor(255, 153, 0);   // Orange text
            } else if (value === 'Low') {
              doc.setFillColor(240, 255, 240); // Light green background
              doc.setTextColor(40, 167, 69);   // Green text
            }
          }
          
          // Style expiry dates
          if (colIndex === 4 && cell.text[0] !== 'N/A') {
            const expiryDate = new Date(cell.text[0]);
            const today = new Date();
            const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 0) {
              // Expired
              doc.setFillColor(255, 200, 200); // Darker red background
              doc.setTextColor(180, 0, 0);     // Dark red text
            } else if (daysDiff < 30) {
              // Expiring soon
              doc.setFillColor(255, 245, 220); // Light orange background
              doc.setTextColor(217, 119, 6);   // Dark orange text
            }
          }
        }
      }
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.setFont("helvetica", "bold");
    doc.text("Inventory Summary", 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "normal");
    
    // Calculate summary statistics
    const totalItems = filteredItems.length;
    const totalQuantity = filteredItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    const categoryCounts = {};
    filteredItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    
    doc.text(`Total Items: ${totalItems}`, 14, finalY + 25);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, finalY + 35);
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 
        doc.internal.pageSize.width - 20, 
        doc.internal.pageSize.height - 10);
    }
    
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

export default Inventory;
