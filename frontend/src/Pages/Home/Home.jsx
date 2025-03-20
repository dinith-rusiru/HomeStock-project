import React, { useEffect, useState } from "react";
import Nav from "../../Component/Nav";
import axios from "axios";
import bg from "../../assest/homestock-sofa-3-years-old.webp";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const URL = "http://localhost:5000/gshoppers";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6F61"];

function Home() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL);
        setInventory(response.data.gshoppers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load inventory data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aggregate data by category
  const categoryData = inventory.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + (item.qty || 0);
    return acc;
  }, {});

  // Convert aggregated data to array for Pie Chart
  const pieChartData = Object.keys(categoryData).map((category) => ({
    name: category,
    value: categoryData[category],
  }));

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Nav />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-6">Track your inventory by category.</p>

          {/* Pie Chart Section */}
          <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Inventory Categories</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ResponsiveContainer width="80%" height={250}>
  <PieChart>
    <Pie 
      data={pieChartData} 
      dataKey="value" 
      nameKey="name" 
      cx="%" 
      cy="50%" 
      outerRadius={80} // Reduced from 100 to 80
      fill="#8884d8" 
      label
    >
      {pieChartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>

            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
