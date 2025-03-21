// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Nav from "../../Component/Nav";
// import { toast, ToastContainer } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { jsPDF } from "jspdf";
// import "react-toastify/dist/ReactToastify.css";

// const ViewList = () => {
//   const [items, setItems] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isFetched, setIsFetched] = useState(false);
//   const history = useNavigate();

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/app/list");
//       setItems(response.data.items );
//       // console.log(response.data.items);
//       console.log(setItems);

//       if (!isFetched) {
//         toast.success("Items fetched successfully!", {
//           position: "top-right",
//           autoClose: 2000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         setIsFetched(true);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch items", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   const handleUpdateItem = (itemId) => {
//     history(`/update-item/${itemId}`);
//     toast.info("Redirecting to update item...", {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   const handleDeleteItem = async (itemId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this item?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`http://localhost:5000/app/list/${itemId}`);
//       setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));

//       toast.success("Item deleted successfully!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       toast.error("Failed to delete item", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   const handleDeleteAll = async () => {
//     const confirmDeleteAll = window.confirm("Are you sure you want to delete all items?");
//     if (!confirmDeleteAll) return;

//     try {
//       await axios.delete("http://localhost:5000/app/list");
//       setItems([]);

//       toast.warning("All items deleted!", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } catch (error) {
//       toast.error("Failed to delete all items", {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   // // Filtered items based on search query
//   // const filteredItems = items.filter((item) =>
//   //   item.name.toLowerCase().includes(searchQuery.toLowerCase())
//   // );

//   const generateReport = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("Grocery List Report", 14, 20);
//     doc.setFontSize(12);
//     doc.text("Item Name", 14, 30);
//     doc.text("Quantity", 140, 30);

//     // let yPosition = 40;

//     // filteredItems.forEach((item) => {
//     //   doc.text(item.name, 14, yPosition);
//     //   doc.text(item.qty.toString(), 140, yPosition);
//     //   yPosition += 10;
//     // });

//     doc.save("grocery_list_report.pdf");

//     toast.success("PDF report generated successfully!", {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
//         <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
//           <h2 className="text-3xl font-bold text-white">Grocery List</h2>
//           <p className="text-blue-100 mt-1">View and manage your grocery items</p>
//         </div>

//         <div className="p-8">
//           <div className="mb-4">
//             <input
//               type="text"
//               placeholder="Search items..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="px-4 py-2 border rounded-md w-full"
//             />
//           </div>

         
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 text-md">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">ITEM NUMBER</th>
//                     <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                     <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                     <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {items.map((item, index) => (
//                     <tr key={item._id} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all">
//                       <td className="px-6 py-4 text-center text-gray-600">{index + 1}</td>
//                       <td className="px-6 py-4 text-center text-gray-600">{item.name}</td>
//                       <td className="px-6 py-4 text-center text-gray-600">{item.qty}</td>
//                       <td className="px-6 py-4 text-center space-x-2">
//                         <button
//                           onClick={() => handleUpdateItem(item._id)}
//                           className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-1 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 cursor-pointer"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteItem(item._id)}
//                           className="bg-gradient-to-r from-red-500 to-red-600 text-white py-1 px-4 rounded-lg hover:from-red-600 hover:to-red-700 cursor-pointer"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
          

//           <div className="mt-6 flex justify-center space-x-4">
//             <button onClick={handleDeleteAll} className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer">Delete List</button>
//             <button onClick={generateReport} className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer">Generate PDF</button>
//           </div>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default ViewList;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";

const ViewList = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetched, setIsFetched] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const history = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/app/list");
      setItems(response.data.items);
      
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
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch items", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setError("Failed to fetch items. Please try again later.");
      setLoading(false);
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
      await axios.delete(`http://localhost:5000/app/list/${itemId}`);
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
      await axios.delete("http://localhost:5000/app/list");
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

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery) {
      setNoResults(false);
      return;
    }

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setNoResults(filtered.length === 0);
  }, [searchQuery, items]);

  // Enhanced PDF report generation
  const generateReport = () => {
    const doc = new jsPDF();
    
    // Add title with style
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Grocery List Report", 14, 20);
    
    // Add space after the title
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 28);
    
    // Table header with style
    const tableHeader = [["Item Number", "Item Name", "Quantity"]];
    
    // Table data
    const filteredItems = items.filter((item) =>
      !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const tableData = filteredItems.map((item, index) => [
      (index + 1).toString(),
      item.name || "N/A",
      item.qty || "N/A"
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
        0: { halign: 'center' },
        1: { fontStyle: 'bold', halign: 'left' },
        2: { halign: 'center' }
      },
      
      // Table border styling
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      tableLineWidth: 0.5,
      tableLineColor: [52, 152, 219]
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.setFont("helvetica", "bold");
    doc.text("Grocery List Summary", 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.setFont("helvetica", "normal");
    
    // Calculate summary statistics
    const totalItems = filteredItems.length;
    const totalQuantity = filteredItems.reduce((sum, item) => sum + (parseInt(item.qty) || 0), 0);
    
    // Print statistics
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
    
    // Save the PDF with a proper filename
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

  // Table Row component
  const ItemTableRow = ({ item, index }) => {
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-center">
          <div className="text-gray-700">{index + 1}</div>
        </td>
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900">{item.name}</div>
        </td>
        <td className="px-6 py-4 text-center">
          <div className="text-gray-700">{item.qty || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => handleUpdateItem(item._id)}
              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit Item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleDeleteItem(item._id)}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
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

  const filteredItems = items.filter((item) =>
    !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Grocery List</h2>
            <p className="text-blue-100 mt-1">View and manage your grocery items</p>
          </div>

          <div className="p-8" ref={componentRef}>
            {/* Search and Add Item Row */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => history('/grocerylist')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md"
              >
                + Add New Item
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
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Item Number
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredItems.map((item, index) => (
                      <ItemTableRow 
                        key={item._id} 
                        item={item}
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleDeleteAll}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white font-medium py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete All Items
              </button>
              
              {/* For now disabled the pdf generation function */}
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-900 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5 flex items-center"
                onClick={generateReport}
                disabled={true}             
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
      <ToastContainer />
    </div>
  );
};

export default ViewList;