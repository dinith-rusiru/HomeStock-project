// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const URL = "http://localhost:5000/gshoppers";

// function Itemtable() {
//   const [gshoppers, setGshoppers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [noResults, setNoResults] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const componentRef = useRef();

//   const fetchHandler = async () => {
//     try {
//       const response = await axios.get(URL);
//       setGshoppers(response.data.gshoppers);
//       setFilteredItems(response.data.gshoppers);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch data. Please try again later.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHandler();
//   }, []);

//   // Search Function
//   const handleSearch = (e) => {     // search by the item name
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (!query) {
//       setFilteredItems(gshoppers);
//       setNoResults(false);
//       return;
//     }

//     const filtered = gshoppers.filter((gshopper) =>
//       gshopper.name.toLowerCase().startsWith(query)
//     );

//     setFilteredItems(filtered);
//     setNoResults(filtered.length === 0);
//   };

//   // Delete function
//   const deleteHandler = async (id) => {
//     await axios.delete(`http://Localhost:5000/gshoppers/${id}`);
//     fetchHandler();
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
    
//     // Add title with style
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Item Table Report", 14, 20);
    
//     // Add space after the title
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
    
//     // Table header with style
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     const tableHeader = [[
//       "Name", "Quantity", "Category", "Important Level", "Expiry Date"
//     ]];
    
//     // Table data
//     const tableData = filteredItems.map((gshopper) => [
//       gshopper.name,
//       gshopper.qty || "N/A",
//       gshopper.category,
//       gshopper.importantlevel || "N/A",
//       gshopper.expdate ? new Date(gshopper.expdate).toISOString().split("T")[0] : "N/A",
//     ]);
    
//     // Add table with enhanced styling
//     autoTable(doc, {
//       startY: 40,
//       head: tableHeader,
//       body: tableData,
//       theme: 'striped',
      
//       // Enhanced header styling
//       headStyles: { 
//         fillColor: [41, 128, 185],  // Vibrant blue color
//         textColor: [255, 255, 255], 
//         fontSize: 12,
//         fontStyle: 'bold',
//         halign: 'center',
//         cellPadding: 5,
//         lineWidth: 0.2,
//       },
      
//       // Body styling
//       bodyStyles: { 
//         fillColor: [245, 245, 245], // Light gray background
//         textColor: [44, 62, 80],    // Dark navy text
//         fontSize: 10, 
//         cellPadding: 4,
//         halign: "center" 
//       },
      
//       // Alternate row styling
//       alternateRowStyles: {
//         fillColor: [255, 255, 255], // White
//       },
      
//       // General styling
//       styles: { 
//         overflow: 'linebreak',
//         cellWidth: 'auto',
//         minCellHeight: 12,
//         lineColor: [189, 195, 199], // Light gray border
//         lineWidth: 0.1,
//       },
      
//       // Column-specific styling
//       columnStyles: {
//         0: { fontStyle: 'bold', halign: 'left' },     // Name column
//         1: { halign: 'center' },                      // Quantity column
//         2: { halign: 'center' },                      // Category column
//         3: { halign: 'center', fontStyle: 'bold' },   // Importance column
//         4: { halign: 'center' }                       // Date column
//       },
      
//       // Table border styling
//       margin: { top: 10, right: 10, bottom: 10, left: 10 },
//       tableLineWidth: 0.5,
//       tableLineColor: [52, 152, 219], // Blue border around entire table
      
//       // Custom cell rendering for important items
//       willDrawCell: function(data) {
//         // Add visual indicators based on cell content
//         if (data.section === 'body') {
//           const cell = data.cell;
//           const colIndex = data.column.index;
          
//           // Style importance levels
//           if (colIndex === 3) { // Importance column
//             const value = cell.text[0];
//             if (value === 'High') {
//               doc.setFillColor(255, 240, 240); // Light red background
//               doc.setTextColor(220, 53, 69);   // Red text
//             } else if (value === 'Medium') {
//               doc.setFillColor(255, 252, 230); // Light yellow background  
//               doc.setTextColor(255, 153, 0);   // Orange text
//             } else if (value === 'Low') {
//               doc.setFillColor(240, 255, 240); // Light green background
//               doc.setTextColor(40, 167, 69);   // Green text
//             }
//           }
          
//           // Style expiry dates
//           if (colIndex === 4 && cell.text[0] !== 'N/A') {
//             const expiryDate = new Date(cell.text[0]);
//             const today = new Date();
//             const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
//             if (daysDiff < 0) {
//               // Expired
//               doc.setFillColor(255, 200, 200); // Darker red background
//               doc.setTextColor(180, 0, 0);     // Dark red text
//             } else if (daysDiff < 30) {
//               // Expiring soon
//               doc.setFillColor(255, 245, 220); // Light orange background
//               doc.setTextColor(217, 119, 6);   // Dark orange text
//             }
//           }
//         }
//       }
//     });
    
//     // Add summary section
//     const finalY = doc.lastAutoTable.finalY || 60;
//     doc.setFontSize(12);
//     doc.setTextColor(41, 128, 185);
//     doc.setFont("helvetica", "bold");
//     doc.text("Inventory Summary", 14, finalY + 15);
    
//     doc.setFontSize(10);
//     doc.setTextColor(44, 62, 80);
//     doc.setFont("helvetica", "normal");
    
//     // Calculate summary statistics
//     const totalItems = filteredItems.length;
//     const totalQuantity = filteredItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
//     const categoryCounts = {};
//     filteredItems.forEach(item => {
//       categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
//     });
    
//     doc.text(`Total Items: ${totalItems}`, 14, finalY + 25);
//     doc.text(`Total Quantity: ${totalQuantity}`, 14, finalY + 35);
    
//     // Add page numbers
//     const pageCount = doc.internal.getNumberOfPages();
//     for(let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Page ${i} of ${pageCount}`, 
//         doc.internal.pageSize.width - 20, 
//         doc.internal.pageSize.height - 10);
//     }
    
//     // Save the generated PDF
//     doc.save("ItemTable_Report.pdf");
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-12 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//             <h2 className="text-3xl font-bold text-white">Item Table</h2>
//             <p className="text-blue-100 mt-1">View and manage your items</p>
//           </div>

//           <div className="p-8" ref={componentRef}>
//             {/* Search Bar */}
//             <div className="mb-6">
//               <input
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 type="text"
//                 name="search"
//                 placeholder="Search"
//                 className="w-75 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {noResults ? (
//               <div className="text-center text-gray-600">
//                 <p>No grocery shoppers found.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border border-gray-200 text-md">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Important Level
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Expiry Date
//                       </th>
//                       <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100">
//                     {filteredItems.map((gshopper, i) => (
//                       <tr key={i} className="hover:bg-gray-50 transition-colors text-center">
//                         <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{gshopper.name}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{gshopper.qty}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{gshopper.category}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{gshopper.importantlevel}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">
//                           {new Date(gshopper.expdate).toISOString().split("T")[0]}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
//                           <Link
//                             to={`/itemtable/${gshopper._id}`}
//                             className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
//                           >
//                             Update
//                           </Link>
//                           <button
//                             onClick={() => deleteHandler(gshopper._id)}
//                             className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex space-x-4 mt-6">
//               <button
//                 className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
//                 onClick={handleDownloadPDF}             
//               >
//                 Download PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Itemtable;











// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const URL = "http://localhost:5000/gshoppers";

// function Itemtable() {
//   const [gshoppers, setGshoppers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [noResults, setNoResults] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const componentRef = useRef();
//   const navigate = useNavigate();

//   const fetchHandler = async () => {
//     try {
//       const response = await axios.get(URL);
//       setGshoppers(response.data.gshoppers);
//       setFilteredItems(response.data.gshoppers);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch data. Please try again later.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHandler();
//   }, []);

//   // Search Function
//   const handleSearch = (e) => {     
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (!query) {
//       setFilteredItems(gshoppers);
//       setNoResults(false);
//       return;
//     }

//     const filtered = gshoppers.filter((gshopper) =>
//       gshopper.name.toLowerCase().startsWith(query)
//     );

//     setFilteredItems(filtered);
//     setNoResults(filtered.length === 0);
//   };

//   // Delete function
//   const deleteHandler = async (id) => {
//     try {
//       await axios.delete(`${URL}/${id}`);
//       fetchHandler();
//     } catch (error) {
//       console.error("Error deleting item:", error);
//       // Could add error handling UI here
//     }
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
    
//     // Add title with style
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Item Table Report", 14, 20);
    
//     // Add space after the title
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
    
//     // Table header with style
//     const tableHeader = [[
//       "Name", "Quantity", "Category", "Important Level", "Expiry Date"
//     ]];
    
//     // Table data
//     const tableData = filteredItems.map((gshopper) => [
//       gshopper.name,
//       gshopper.qty || "N/A",
//       gshopper.category,
//       gshopper.importantlevel || "N/A",
//       gshopper.expdate ? new Date(gshopper.expdate).toISOString().split("T")[0] : "N/A",
//     ]);
    
//     // Add table with enhanced styling
//     autoTable(doc, {
//       startY: 40,
//       head: tableHeader,
//       body: tableData,
//       theme: 'striped',
      
//       // Enhanced header styling
//       headStyles: { 
//         fillColor: [41, 128, 185],
//         textColor: [255, 255, 255], 
//         fontSize: 12,
//         fontStyle: 'bold',
//         halign: 'center',
//         cellPadding: 5,
//         lineWidth: 0.2,
//       },
      
//       // Body styling
//       bodyStyles: { 
//         fillColor: [245, 245, 245],
//         textColor: [44, 62, 80],
//         fontSize: 10, 
//         cellPadding: 4,
//         halign: "center" 
//       },
      
//       // Alternate row styling
//       alternateRowStyles: {
//         fillColor: [255, 255, 255],
//       },
      
//       // General styling
//       styles: { 
//         overflow: 'linebreak',
//         cellWidth: 'auto',
//         minCellHeight: 12,
//         lineColor: [189, 195, 199],
//         lineWidth: 0.1,
//       },
      
//       // Column-specific styling
//       columnStyles: {
//         0: { fontStyle: 'bold', halign: 'left' },
//         1: { halign: 'center' },
//         2: { halign: 'center' },
//         3: { halign: 'center', fontStyle: 'bold' },
//         4: { halign: 'center' }
//       },
      
//       // Table border styling
//       margin: { top: 10, right: 10, bottom: 10, left: 10 },
//       tableLineWidth: 0.5,
//       tableLineColor: [52, 152, 219],
      
//       // Custom cell rendering for important items
//       willDrawCell: function(data) {
//         if (data.section === 'body') {
//           const cell = data.cell;
//           const colIndex = data.column.index;
          
//           // Style importance levels
//           if (colIndex === 3) {
//             const value = cell.text[0];
//             if (value === 'High') {
//               doc.setFillColor(255, 240, 240);
//               doc.setTextColor(220, 53, 69);
//             } else if (value === 'Medium') {
//               doc.setFillColor(255, 252, 230);
//               doc.setTextColor(255, 153, 0);
//             } else if (value === 'Low') {
//               doc.setFillColor(240, 255, 240);
//               doc.setTextColor(40, 167, 69);
//             }
//           }
          
//           // Style expiry dates
//           if (colIndex === 4 && cell.text[0] !== 'N/A') {
//             const expiryDate = new Date(cell.text[0]);
//             const today = new Date();
//             const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            
//             if (daysDiff < 0) {
//               // Expired
//               doc.setFillColor(255, 200, 200);
//               doc.setTextColor(180, 0, 0);
//             } else if (daysDiff < 30) {
//               // Expiring soon
//               doc.setFillColor(255, 245, 220);
//               doc.setTextColor(217, 119, 6);
//             }
//           }
//         }
//       }
//     });
    
//     // Add summary section
//     const finalY = doc.lastAutoTable.finalY || 60;
//     doc.setFontSize(12);
//     doc.setTextColor(41, 128, 185);
//     doc.setFont("helvetica", "bold");
//     doc.text("Inventory Summary", 14, finalY + 15);
    
//     doc.setFontSize(10);
//     doc.setTextColor(44, 62, 80);
//     doc.setFont("helvetica", "normal");
    
//     // Calculate summary statistics
//     const totalItems = filteredItems.length;
//     const totalQuantity = filteredItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
//     const categoryCounts = {};
//     filteredItems.forEach(item => {
//       categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
//     });
    
//     doc.text(`Total Items: ${totalItems}`, 14, finalY + 25);
//     doc.text(`Total Quantity: ${totalQuantity}`, 14, finalY + 35);
    
//     // Add page numbers
//     const pageCount = doc.internal.getNumberOfPages();
//     for(let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(8);
//       doc.setTextColor(100, 100, 100);
//       doc.text(`Page ${i} of ${pageCount}`, 
//         doc.internal.pageSize.width - 20, 
//         doc.internal.pageSize.height - 10);
//     }
    
//     // Save the generated PDF
//     doc.save("ItemTable_Report.pdf");
//   };

//   // Get importance level badge 
//   const getImportanceBadge = (level) => {
//     switch(level) {
//       case 'High':
//         return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
//       case 'Medium':
//         return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
//       case 'Low':
//         return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>;
//       default:
//         return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{level || 'N/A'}</span>;
//     }
//   };

//   // Get expiry date status
//   const getExpiryStatus = (date) => {
//     if (!date) return <span className="text-gray-500">N/A</span>;
    
//     const expiryDate = new Date(date);
//     const today = new Date();
//     const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
//     const formattedDate = new Date(date).toLocaleDateString();
    
//     if (daysDiff < 0) {
//       return <span className="text-red-600 font-medium">{formattedDate} (Expired)</span>;
//     } else if (daysDiff < 30) {
//       return <span className="text-orange-600 font-medium">{formattedDate} ({daysDiff} days left)</span>;
//     } else {
//       return <span className="text-gray-700">{formattedDate}</span>;
//     }
//   };

//   // Table row component (formerly ItemTableDetails)
//   const TableRow = ({ gshopper }) => {
//     const { _id, name, qty, category, importantlevel, expdate } = gshopper;

//     return (
//       <tr className="hover:bg-gray-50 transition-colors">
//         <td className="px-6 py-4">
//           <div className="font-medium text-gray-900">{name}</div>
//         </td>
//         <td className="px-6 py-4 text-center">
//           <div className="text-gray-700">{qty || 'N/A'}</div>
//         </td>
//         <td className="px-6 py-4 text-center">
//           <div className="text-gray-700">{category}</div>
//         </td>
//         <td className="px-6 py-4 text-center">
//           {getImportanceBadge(importantlevel)}
//         </td>
//         <td className="px-6 py-4 text-center">
//           {getExpiryStatus(expdate)}
//         </td>
//         <td className="px-6 py-4">
//           <div className="flex justify-center space-x-2">
//             <Link
//               to={`/itemtable/${_id}`}
//               className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
//               title="Edit Item"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
//               </svg>
//             </Link>
//             <button 
//               onClick={() => deleteHandler(_id)}
//               className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
//               title="Delete Item"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//               </svg>
//             </button>
//             <button 
//               className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
//               title="View Details"
//               onClick={() => navigate(`/itemdetails/${_id}`)}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </button>
//           </div>
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-12 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
//             <h2 className="text-3xl font-bold text-white">Item Table</h2>
//             <p className="text-blue-100 mt-1">View and manage your items</p>
//           </div>

//           <div className="p-8" ref={componentRef}>
//             {/* Search and Add Item Row */}
//             <div className="flex justify-between items-center mb-6">
//               <div className="w-1/2">
//                 <input
//                   value={searchQuery}
//                   onChange={handleSearch}
//                   type="text"
//                   name="search"
//                   placeholder="Search by item name"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <Link
//                 to="/additem"
//                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
//               >
//                 + Add New Item
//               </Link>
//             </div>

//             {noResults ? (
//               <div className="text-center py-8 bg-gray-50 rounded-lg">
//                 <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                 </svg>
//                 <p className="mt-2 text-gray-600">No items found matching "{searchQuery}"</p>
//                 <button 
//                   onClick={() => setSearchQuery("")} 
//                   className="mt-3 text-blue-600 hover:underline"
//                 >
//                   Clear search
//                 </button>
//               </div>
//             ) : (
//               <div className="overflow-x-auto bg-white rounded-lg shadow">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-50 border-b border-gray-200">
//                       <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Category
//                       </th>
//                       <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Importance
//                       </th>
//                       <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Expiry Date
//                       </th>
//                       <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100">
//                     {filteredItems.map((gshopper) => (
//                       <TableRow 
//                         key={gshopper._id} 
//                         gshopper={gshopper}
//                       />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Bottom Action Buttons */}
//             <div className="flex space-x-4 mt-6">
//               <button
//                 className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
//                 onClick={handleDownloadPDF}             
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
//                 </svg>
//                 Download PDF Report
//               </button>
              
//               {/* <button 
//                 className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
//                 onClick={fetchHandler}
//               >
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
//                 </svg>
//                 Refresh Data
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Itemtable;







import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Calculate stats for the cards
  const totalItems = filteredItems.length;
  // const highPriorityItems = filteredItems.filter(item => item.importantlevel === 'High').length;
  const highPriorityItems = filteredItems.filter(item => item.importantlevel === '5 - High' || item.importantlevel === 5 || item.importantlevel === 'High').length;
  const expiringItems = filteredItems.filter(item => {
    if (!item.expdate) return false;
    const expiryDate = new Date(item.expdate);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysDiff < 30 && daysDiff >= 0;
  }).length;
  const expiredItems = filteredItems.filter(item => {
    if (!item.expdate) return false;
    const expiryDate = new Date(item.expdate);
    const today = new Date();
    return expiryDate < today;
  }).length;

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

  // Delete function
  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      fetchHandler();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  //print pdf
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

  //   // Add table with enhanced styling
  //   autoTable(doc, {
  //     startY: 40,
  //     head: tableHeader,
  //     body: tableData,
  //     theme: 'striped',
  //     headStyles: {
  //       fillColor: [41, 128, 185],
  //       textColor: [255, 255, 255],
  //       fontSize: 12,
  //       fontStyle: 'bold',
  //       halign: 'center',
  //       cellPadding: 5,
  //       lineWidth: 0.2,
  //     },
  //     bodyStyles: {
  //       fillColor: [245, 245, 245],
  //       textColor: [44, 62, 80],
  //       fontSize: 10,
  //       cellPadding: 4,
  //       halign: "center"
  //     },
  //     alternateRowStyles: {
  //       fillColor: [255, 255, 255],
  //     },
  //     styles: {
  //       overflow: 'linebreak',
  //       cellWidth: 'auto',
  //       minCellHeight: 12,
  //       lineColor: [189, 195, 199],
  //       lineWidth: 0.1,
  //     },
  //     columnStyles: {
  //       0: { fontStyle: 'bold', halign: 'left' },
  //       1: { halign: 'center' },
  //       2: { halign: 'center' },
  //       3: { halign: 'center', fontStyle: 'bold' },
  //       4: { halign: 'center' }
  //     },
  //     margin: { top: 10, right: 10, bottom: 10, left: 10 },
  //     tableLineWidth: 0.5,
  //     tableLineColor: [52, 152, 219],
  //     willDrawCell: function (data) {
  //       if (data.section === 'body') {
  //         const cell = data.cell;
  //         const colIndex = data.column.index;

  //         // Style importance levels
  //         if (colIndex === 3) {
  //           const value = cell.text[0];
  //           if (value === 'High') {
  //             doc.setFillColor(255, 240, 240);
  //             doc.setTextColor(220, 53, 69);
  //           } else if (value === 'Medium') {
  //             doc.setFillColor(255, 252, 230);
  //             doc.setTextColor(255, 153, 0);
  //           } else if (value === 'Low') {
  //             doc.setFillColor(240, 255, 240);
  //             doc.setTextColor(40, 167, 69);
  //           }
  //         }

  //         // Style expiry dates
  //         if (colIndex === 4 && cell.text[0] !== 'N/A') {
  //           const expiryDate = new Date(cell.text[0]);
  //           const today = new Date();
  //           const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  //           if (daysDiff < 0) {
  //             // Expired
  //             doc.setFillColor(255, 200, 200);
  //             doc.setTextColor(180, 0, 0);
  //           } else if (daysDiff < 30) {
  //             // Expiring soon
  //             doc.setFillColor(255, 245, 220);
  //             doc.setTextColor(217, 119, 6);
  //           }
  //         }
  //       }
  //     }
  //   });

  //   // Add summary section
  //   const finalY = doc.lastAutoTable.finalY || 60;
  //   doc.setFontSize(12);
  //   doc.setTextColor(41, 128, 185);
  //   doc.setFont("helvetica", "bold");
  //   doc.text("Inventory Summary", 14, finalY + 15);

  //   doc.setFontSize(10);
  //   doc.setTextColor(44, 62, 80);
  //   doc.setFont("helvetica", "normal");

  //   // Calculate summary statistics
  //   const totalQuantity = filteredItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
  //   const categoryCounts = {};
  //   filteredItems.forEach(item => {
  //     categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  //   });

  //   doc.text(`Total Items: ${totalItems}`, 14, finalY + 25);
  //   doc.text(`Total Quantity: ${totalQuantity}`, 14, finalY + 35);

  //   // Add page numbers
  //   const pageCount = doc.internal.getNumberOfPages();
  //   for (let i = 1; i <= pageCount; i++) {
  //     doc.setPage(i);
  //     doc.setFontSize(8);
  //     doc.setTextColor(100, 100, 100);
  //     doc.text(`Page ${i} of ${pageCount}`,
  //       doc.internal.pageSize.width - 20,
  //       doc.internal.pageSize.height - 10);
  //   }

  //   // Save the generated PDF
  //   doc.save("ItemTable_Report.pdf");
  // };

  // Get importance level badge
  const getImportanceBadge = (level) => {
    switch (level) {
      case 'High':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 'Medium':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 'Low':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{level || 'N/A'}</span>;
    }
  };

  // Get expiry date status
  const getExpiryStatus = (date) => {
    if (!date) return <span className="text-gray-500">N/A</span>;

    const expiryDate = new Date(date);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    const formattedDate = new Date(date).toLocaleDateString();

    if (daysDiff < 0) {
      return <span className="text-red-600 font-medium">{formattedDate} (Expired)</span>;
    } else if (daysDiff < 30) {
      return <span className="text-orange-600 font-medium">{formattedDate} ({daysDiff} days left)</span>;
    } else {
      return <span className="text-gray-700">{formattedDate}</span>;
    }
  };

  // Table row component
  const TableRow = ({ gshopper }) => {
    const { _id, name, qty, category, importantlevel, expdate } = gshopper;

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
          {getImportanceBadge(importantlevel)}
        </td>
        <td className="px-6 py-4 text-center">
          {getExpiryStatus(expdate)}
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center space-x-2">
            <Link
              to={`/itemtable/${_id}`}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit Item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </Link>
            <button
              onClick={() => deleteHandler(_id)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <button
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="View Details"
              onClick={() => navigate(`/itemdetails/${_id}`)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
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
            <h2 className="text-3xl font-bold text-white">Item Table</h2>
            <p className="text-blue-100 mt-1">View and manage your items</p>
          </div>

          <div className="p-8" ref={componentRef}>
            {/* Header Section */}
            {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Inventory Management</h2>
                    <p className="text-indigo-100">View, filter and manage your inventory items</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button
                      className="bg-white text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
                      onClick={handleDownloadPDF}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Download PDF Report
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Items */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Items</p>
                    <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                  </div>
                </div>
              </div>

              {/* High Priority */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 mr-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">High Priority</p>
                    <p className="text-2xl font-bold text-gray-800">{highPriorityItems}</p>
                  </div>
                </div>
              </div>

              {/* Expiring Soon */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mr-4">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
                    <p className="text-2xl font-bold text-gray-800">{expiringItems}</p>
                  </div>
                </div>
              </div>

              {/* Expired */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-100 mr-4">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Expired Items</p>
                    <p className="text-2xl font-bold text-gray-800">{expiredItems}</p>
                  </div>
                </div>
              </div>
            </div>

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
              <Link
                to="/additem"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
              >
                + Add New Item
              </Link>
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
                        Importance
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((gshopper) => (
                      <TableRow
                        key={gshopper._id}
                        gshopper={gshopper}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
                // onClick={handleDownloadPDF}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemtable;