// //taking data from the backend

// import React, { useEffect, useState } from "react";
// import Nav from "../../Component/Nav";
// import axios from "axios";
// import Itemtabledetails from "./Itemtabledetails";

// const URL = "http://Localhost:5000/gshoppers";

// function Itemtable() {
//   const [gshoppers, setGshoppers] = useState();

//   const fetchHandler = async () => {
//     return await axios.get(URL).then((res) => setGshoppers(res.data.gshoppers));
//   };

//   useEffect(() => {
//     fetchHandler();
//   }, []);

//   return (
//     <div>
//       <Nav />
//       <h1>Item Table</h1>
//       <br></br>
//       <div>
//         {gshoppers &&
//           gshoppers.map((gshopper, i) => (
//             <div key={i}>
//               <Itemtabledetails gshopper={gshopper} refreshData={fetchHandler}/>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default Itemtable;

//taking data from the backend

import React, { useEffect, useState, useRef } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import Itemtabledetails from "./Itemtabledetails";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/gshoppers";

function Itemtable() {
  const [gshoppers, setGshoppers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const fetchHandler = async () => {
    try {
      const response = await axios.get(URL);
      setGshoppers(response.data.gshoppers);
      return response.data; // Return data for search functionality
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  // Print PDF
  const ComponentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentRef.current,
    documentTitle: "Home Stock - Item Table", // Corrected typo
    onAfterPrint: () => alert("Item table Report Successfully Downloaded"), // Corrected typo
  });

  // Search Function
  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filterGshoppers = data.gshoppers.filter((gshopper) =>
        Object.values(gshopper).some(
          (field) =>
            field.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Corrected typo
        )
      );
      setGshoppers(filterGshoppers);
      setNoResults(filterGshoppers.length === 0); // Corrected typo
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Item Table</h2>
            <p className="text-blue-100 mt-1 ">View and manage your items</p>
          </div>

          <div className="p-8 " ref={ComponentRef}>
            {/* Search Bar */}

            <div className="mb-6">
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value); // Call the search function directly
                }}
                type="text"
                name="search"
                placeholder="Search"
                className="w-75 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {noResults ? (
              <div className="text-center text-gray-600">
                <p>No Grocery shoppers Found</p>
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
                    {gshoppers &&
                      gshoppers.map((gshopper, i) => (
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

            <button
              className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transform transition hover:-translate-y-0.5"
              onClick={handlePrint}
            >
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemtable;
