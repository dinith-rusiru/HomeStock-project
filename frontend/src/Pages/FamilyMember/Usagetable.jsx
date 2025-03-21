import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Using the fmembers URL for fetching usages
const URL = "http://localhost:5000/fmembers";

function Usagetable() {
  const [usages, setUsages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsages, setFilteredUsages] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const navigate = useNavigate();

  // Fetch data from API
  const fetchHandler = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      
      // Since we're now using a dedicated FmemberModel, the data structure is simpler
      const allData = Array.isArray(response.data) ? response.data : 
                     (response.data.users || []);
      
      setUsages(allData);
      setFilteredUsages(allData);
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
      setFilteredUsages(usages);
      setNoResults(false);
      return;
    }

    const filtered = usages.filter((usage) =>
      usage.name.toLowerCase().startsWith(query)
    );

    setFilteredUsages(filtered);
    setNoResults(filtered.length === 0);
  };

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
    const tableHeader = [[
      "Item Name", "Quantity Used", "Category", "Usage Date", "Notes"
    ]];
    
    // Table data
    const tableData = filteredUsages.map((usage) => [
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
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255], 
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 5,
        lineWidth: 0.2,
      },
      
      // Body styling
      bodyStyles: { 
        fillColor: [245, 245, 245],
        textColor: [44, 62, 80],
        fontSize: 10, 
        cellPadding: 4,
        halign: "center" 
      },
      
      // Alternate row styling
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      
      // General styling
      styles: { 
        overflow: 'linebreak',
        cellWidth: 'auto',
        minCellHeight: 12,
        lineColor: [189, 195, 199],
        lineWidth: 0.1,
      },
      
      // Column-specific styling
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'left' }
      },
      
      // Table border styling
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      tableLineWidth: 0.5,
      tableLineColor: [52, 152, 219],
      
      // Custom cell rendering for recent usage
      willDrawCell: function(data) {
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
              doc.setFillColor(230, 245, 255);
              doc.setTextColor(0, 102, 204);
            } else if (daysDiff < 30) {
              // Usage within a month
              doc.setFillColor(240, 255, 240);
              doc.setTextColor(0, 153, 51);
            }
          }
          
          // Style quantities
          if (colIndex === 1) {
            const value = parseInt(cell.text[0]);
            if (!isNaN(value) && value > 10) {
              doc.setFillColor(255, 245, 230);
              doc.setTextColor(204, 102, 0);
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
    const totalRecords = filteredUsages.length;
    const totalQuantity = filteredUsages.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    
    // Calculate usage by category
    const categoryCounts = {};
    filteredUsages.forEach(item => {
      if (item.category) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      }
    });
    
    // Print statistics
    doc.text(`Total Usage Records: ${totalRecords}`, 14, finalY + 25);
    doc.text(`Total Quantity Used: ${totalQuantity}`, 14, finalY + 35);
    
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  // Get usage date status styling (similar to expiry status in Itemtable)
  const getUsageStatus = (date) => {
    if (!date) return <span className="text-gray-500">N/A</span>;
    
    const usageDate = new Date(date);
    const today = new Date();
    const daysDiff = Math.ceil((today - usageDate) / (1000 * 60 * 60 * 24));
    
    const formattedDate = formatDate(date);
    
    if (daysDiff < 7) {
      return <span className="text-green-600 font-medium">{formattedDate} (Recent)</span>;
    } else if (daysDiff < 30) {
      return <span className="text-blue-600 font-medium">{formattedDate}</span>;
    } else {
      return <span className="text-gray-700">{formattedDate}</span>;
    }
  };

  // UsageTableRow component
  const UsageTableRow = ({ fmember }) => {
    const { _id, name, qty, category, usagedate, notes } = fmember;
  
    // Delete function
    const deleteHandler = async () => {
      try {
        await axios.delete(`http://localhost:5000/fmembers/${_id}`);
        toast.success("Usage deleted successfully!");
        fetchHandler(); // Refresh data
      } catch (error) {
        console.error("Error deleting usage:", error);
        toast.error("Failed to delete usage. Please try again.");
      }
    };
  
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{name}</div>
        </td>
        <td className="px-6 py-4 text-center">
          <div className="text-gray-700">{qty || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 text-center">
          <div className="text-gray-700">{category}</div>
        </td>
        <td className="px-6 py-4 text-center">
          {getUsageStatus(usagedate)}
        </td>
        <td className="px-6 py-4 text-center">
          <div className="text-gray-700">{notes || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => navigate(`/editusage/${_id}`, { state: { fmember } })}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit Usage"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button 
              onClick={deleteHandler}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Usage"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            {/* <button 
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="View Details"
              onClick={() => navigate(`/usagedetails/${_id}`)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button> */}
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Usage Table</h2>
            <p className="text-blue-100 mt-1">View and manage your usage records</p>
          </div>

          <div className="p-8" ref={componentRef}>
            {/* Search and Add Item Row */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-1/2">
                <input
                  value={searchQuery}
                  onChange={handleSearch}
                  type="text"
                  name="search"
                  placeholder="Search by item name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => navigate('/addusage')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
              >
                + Add New Usage
              </button>
            </div>

            {noResults ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-2 text-gray-600">No items found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="mt-3 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Usage Date
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredUsages.map((usage) => (
                      <UsageTableRow 
                        key={usage._id} 
                        fmember={usage}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-900 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
                onClick={handleDownloadPDF}             
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download PDF Report
              </button>
              
              {/* <button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
                onClick={fetchHandler}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh Data
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usagetable;