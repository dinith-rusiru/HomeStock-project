import React, { useEffect, useState, useRef } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Usagetableupdatedel from "./Usagetableupdatedel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Using the fmembers URL for fetching usages
const URL = "http://localhost:5000/fmembers";

function Usagetable() {
  const [usages, setUsages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();

  // Fetch data from API
  const fetchHandler = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      
      // Since we're now using a dedicated FmemberModel, the data structure is simpler
      const allData = Array.isArray(response.data) ? response.data : 
                     (response.data.users || []);
      
      // No need to filter by usagedate anymore since all records in fmembers have usagedate
      console.log("Usage data:", allData); // Debug log
      setUsages(allData);
      setLoading(false);
      return { users: allData }; // Keep the same format for the search function
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  // Print PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Usage Report",
    onAfterPrint: () => alert("Usage Report Successfully Downloaded"),
  });

  // PDF Generation Function
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title with style
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Usage Report", 14, 20);
    
    // Add space after the title
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
    
    // Table header with style
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const tableHeader = [[
      "Item Name", "Quantity Used", "Category", "Usage Date", "Notes"
    ]];
    
    // Table data
    const tableData = usages.map((usage) => [
      usage.name || "N/A",
      usage.qty || "N/A",
      usage.category || "N/A",
      usage.usagedate ? new Date(usage.usagedate).toLocaleDateString() : "N/A",
      usage.notes || "N/A",
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
        0: { fontStyle: 'bold', halign: 'left' },     // Item Name column
        1: { halign: 'center' },                      // Quantity Used column
        2: { halign: 'center' },                      // Category column
        3: { halign: 'center' },                      // Usage Date column
        4: { halign: 'left' }                         // Notes column
      },
      
      // Table border styling
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      tableLineWidth: 0.5,
      tableLineColor: [52, 152, 219], // Blue border around entire table
      
      // Custom cell rendering for recent usage
      willDrawCell: function(data) {
        // Add visual indicators based on cell content
        if (data.section === 'body') {
          const cell = data.cell;
          const colIndex = data.column.index;
          
          // Style dates (more recent dates are highlighted)
          if (colIndex === 3 && cell.text[0] !== 'N/A') {
            const usageDate = new Date(cell.text[0]);
            const today = new Date();
            const daysDiff = Math.ceil((today - usageDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 7) {
              // Recent usage (last 7 days)
              doc.setFillColor(230, 245, 255); // Light blue background
              doc.setTextColor(0, 102, 204);   // Blue text
            } else if (daysDiff < 30) {
              // Usage within a month
              doc.setFillColor(240, 255, 240); // Light green background
              doc.setTextColor(0, 153, 51);    // Green text
            }
          }
          
          // Style quantities
          if (colIndex === 1) {
            const value = parseInt(cell.text[0]);
            if (!isNaN(value) && value > 10) {
              doc.setFillColor(255, 245, 230); // Light orange background
              doc.setTextColor(204, 102, 0);   // Orange text
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
    doc.text("Usage Summary", 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "normal");
    
    // Calculate summary statistics
    const totalRecords = usages.length;
    const totalQuantity = usages.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    
    // Calculate usage by category
    const categoryCounts = {};
    usages.forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    
    // Find most recent usage
    let mostRecentDate = null;
    usages.forEach(item => {
      if (item.usagedate) {
        const itemDate = new Date(item.usagedate);
        if (!mostRecentDate || itemDate > mostRecentDate) {
          mostRecentDate = itemDate;
        }
      }
    });
    
    // Print statistics
    doc.text(`Total Usage Records: ${totalRecords}`, 14, finalY + 25);
    doc.text(`Total Quantity Used: ${totalQuantity}`, 14, finalY + 35);
    if (mostRecentDate) {
      doc.text(`Most Recent Usage: ${mostRecentDate.toLocaleDateString()}`, 14, finalY + 45);
    }
    
    // Add usage by category breakdown
    let categoryY = finalY + 55;
    if (Object.keys(categoryCounts).length > 0) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Usage by Category:", 14, categoryY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      
      categoryY += 10;
      Object.entries(categoryCounts).forEach(([category, count]) => {
        doc.text(`${category}: ${count} records`, 20, categoryY);
        categoryY += 8;
      });
    }
    
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
    doc.save("Usage_Report.pdf");
  };

  // Search Function
  const handleSearch = () => {
    fetchHandler().then((data) => {
      if (data && data.users) {
        // Simplified search filter without need to check for usagedate
        const filteredUsages = data.users.filter((usage) =>
          Object.values(usage).some((field) =>
            field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        
        setUsages(filteredUsages);
        setNoResults(filteredUsages.length === 0);
      }
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
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
            <h2 className="text-3xl font-bold text-white">Usage Table</h2>
            <p className="text-blue-100 mt-1 ">View and manage your usage records</p>
          </div>

          <div className="p-8" ref={componentRef}>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                name="search"
                placeholder="Search"
                className="w-75 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 float"
              />
              <button
                onClick={handleSearch}
                className="ml-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
              >
                Search
              </button>
            </div>

            {noResults ? (
              <div className="text-center text-gray-600">
                <p>No Usage Records Found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-md">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Quantity Used
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Usage Date
                      </th>
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      {/* Added Actions column header */}
                      <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {/* Replaced standard rows with the Usagetableupdatedel component */}
                    {usages &&
                      usages.map((usage, i) => (
                        <Usagetableupdatedel 
                          key={i} 
                          fmember={usage} 
                          refreshData={fetchHandler} 
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4 mt-6">
              {/* <button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                onClick={handlePrint}
              >
                Print Report
              </button> */}

              <button
                className="bg-gradient-to-r from-purple-400 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
                onClick={handleDownloadPDF}             
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usagetable;