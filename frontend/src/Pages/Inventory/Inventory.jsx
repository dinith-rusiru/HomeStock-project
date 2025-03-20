import { useEffect, useState } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";

const URL = "http://localhost:5000/gshoppers";

function Inventory() {
  const [gshoppers, setGshoppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(URL);
        setGshoppers(response.data.gshoppers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchHandler();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  // Group items by category
  const categorizedItems = gshoppers.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white">Inventory</h2>
            <p className="text-blue-100 mt-1">Manage and track your home essentials</p>
          </div>

          <div className="p-8">
            {Object.keys(categorizedItems).map((category) => (
              <div key={category} className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categorizedItems[category].map((item) => (
                    <div key={item._id} className="bg-white shadow-md rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-gray-700">{item.name}</h4>
                      <p className="text-gray-600">Quantity: {item.qty}</p>
                      <p className="text-gray-600">Importance: {item.importantlevel}</p>
                      <p className="text-gray-600">
                        Expiry: {item.expdate ? new Date(item.expdate).toISOString().split("T")[0] : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
