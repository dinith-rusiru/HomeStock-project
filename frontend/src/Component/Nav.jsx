import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="bg-blue-600 p-4 shadow-md">
      <ul className="flex justify-center space-x-6 text-white">
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/mainhome" className="text-lg font-semibold">Home</Link>
        </li>   
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/additem" className="text-lg font-semibold">Add Item</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/itemtable" className="text-lg font-semibold">Item Table</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/useitem" className="text-lg font-semibold">Use Item</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/grocerylist" className="text-lg font-semibold">Add New Grocery List</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/viewgrocerylist" className="text-lg font-semibold">View Grocery List</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/inventory" className="text-lg font-semibold">Inventory</Link>
        </li>
        <li className="hover:bg-blue-700 px-4 py-2 rounded-lg transition ease-in-out duration-300">
          <Link to="/specialfuncion" className="text-lg font-semibold">Special Function</Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
