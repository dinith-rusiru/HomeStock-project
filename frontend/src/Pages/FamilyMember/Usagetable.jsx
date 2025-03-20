import React, { useEffect, useState, useRef } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Usagetableupdatedel from "./Usagetableupdatedel";

// Using the fmembers URL for fetching usages
const URL = "http://localhost:5000/fmembers";

function Usagetable() {
  const [usages, setUsages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  // Fetch data from API
  const fetchHandler = async () => {
    try {
      const response = await axios.get(URL);
      
      // Since we're now using a dedicated FmemberModel, the data structure is simpler
      const allData = Array.isArray(response.data) ? response.data : 
                     (response.data.users || []);
      
      // No need to filter by usagedate anymore since all records in fmembers have usagedate
      console.log("Usage data:", allData); // Debug log
      setUsages(allData);
      return { users: allData }; // Keep the same format for the search function
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
    documentTitle: "Usage Report",
    onAfterPrint: () => alert("Usage Report Successfully Downloaded"),
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Usage Table</h2>
            <p className="text-blue-100 mt-1 ">View and manage your usage records</p>
          </div>

          <div className="p-8" ref={ComponentRef}>
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

export default Usagetable;