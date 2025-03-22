import React from 'react';
import { CiSearch } from "react-icons/ci"; // Search icon
import { FaUserAlt } from "react-icons/fa"; // User icon
import { IoCart, IoHome } from "react-icons/io5"; // Cart and Home icon
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="bg-blue-600/90 p-4 shadow-md flex justify-between items-center">
      
      {/* Left Section: Navigation Links */}
      <ul className="flex space-x-8 text-white">
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/mainhome" className="text-lg font-semibold"><IoHome /></Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/additem" className="text-lg font-semibold">Add Item</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/addusage" className="text-lg font-semibold">Add Usage</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/itemtable" className="text-lg font-semibold">Item Table</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/usagetable" className="text-lg font-semibold">Item Usage</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/grocerylist" className="text-lg font-semibold">Grocery List</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/viewgrocerylist" className="text-lg font-semibold">View Grocery List</Link>
        </li>
        <li className="hover:bg-blue-700 px-5 py-2 rounded-full transition ease-in-out duration-300">
          <Link to="/inventory" className="text-lg font-semibold">Inventory</Link>
        </li>
      </ul>
      
      {/* Right Section: User Icon and Login Button */}
      <div className="flex space-x-6">
        <div className="relative">
          <button className="flex items-center space-x-2">
            <FaUserAlt className="text-white text-2xl" />
          </button>
        </div>
        <Link to="/sign-up">
          <button className="bg-green-500 px-4 py-2 rounded-full text-white font-semibold hover:bg-green-600 transition ease-in-out duration-300">
            Login
          </button>
        </Link>
      </div>
      
    </div>
  );
};

export default Header;
