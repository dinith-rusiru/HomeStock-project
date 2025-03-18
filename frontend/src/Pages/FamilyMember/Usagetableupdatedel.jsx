import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Usagetableupdatedel({ fmember, refreshData }) {
  const { _id, name, qty, category, usagedate, notes } = fmember;
  const id = _id;
  const navigate = useNavigate();

  // Delete function
  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/fmembers/${id}`);
    refreshData();
    navigate("/usagetable");
  };

  // Update function
  const updateHandler = () => {
    // Store the ID in localStorage or state management before navigating
    localStorage.setItem("editUsageId", id);
    navigate("/editusage");
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
    <tr className="hover:bg-gray-50 transition-colors text-center">
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{qty}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{formatDate(usagedate)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{notes}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button
          onClick={updateHandler}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
        >
          Update
        </button>
        <button
          onClick={deleteHandler}
          className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default Usagetableupdatedel;