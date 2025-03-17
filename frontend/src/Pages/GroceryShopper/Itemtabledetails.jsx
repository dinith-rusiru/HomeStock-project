// //displaying the data that taking form the database

// import React from 'react'
// import { Link,useParams  } from 'react-router-dom';
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

// function Itemtabledetails(props) {
//   const {_id,name,qty,category,importantlevel,expdate} = props.gshopper;
//   const id = _id;
//   const navigate = useNavigate();

//   //delete funciton

//   const deleteHandler = async() => {
    
//     await axios.delete(`http://Localhost:5000/gshoppers/${id}`)
//     props.refreshData();
//     navigate('/itemtable');
//   }
  
//   return (
//     <div>
//       <div>
//        <h1>Name: {name}</h1>
//        <h1 >Quantity: {qty}</h1>
//        <h1>Category: {category}</h1>
//        <h1>Important Level: {importantlevel}</h1>
//        <h1>Expiry Date: {new Date(expdate).toISOString().split("T")[0]}</h1>
//        <div>
//        <Link to={`/itemtable/${id}`}>
//           Update
//       </Link>
//          <button onClick={deleteHandler}>Delete</button>
//          <br></br><br></br> 

//        </div>
//      </div>
      
//     </div>
//   )
// }

// export default Itemtabledetails



// //displaying the data that taking form the database
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Itemtabledetails({ gshopper, refreshData }) {
  const { _id, name, qty, category, importantlevel, expdate } = gshopper;
  const id = _id;
  const navigate = useNavigate();

  // Delete function
  const deleteHandler = async () => {
    await axios.delete(`http://Localhost:5000/gshoppers/${id}`);
    refreshData();
    navigate("/itemtable");
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors text-center">
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700 ">{qty}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">{importantlevel}</td>
      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-700">
        {new Date(expdate).toISOString().split("T")[0]}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <Link
          to={`/itemtable/${id}`}
          className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-teal-600 transition-all shadow-md"
        >
          Update
        </Link>
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

export default Itemtabledetails;