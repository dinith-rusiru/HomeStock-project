import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Itemtabledetails from './Pages/GroceryShopper/Itemtabledetails';
import ItemTable from "./Pages/GroceryShopper/Itemtable";
import UseItem from './Pages/FamilyMember/Useitem' 
import Addlist from "./Pages/ListManager/Addlist";
import Inventory from "./Pages/Inventory/Inventory";
import Specialfuction from "./Pages/SpecialFunction/specialfuction";
import Additem from "./Pages/GroceryShopper/Additem";
import EditItem from "./Pages/GroceryShopper/Edititem";
import Viewlist from "./Pages/ListManager/Viewlist";
import Updatelist from "./Pages/ListManager/Updatelist";
import ListDetail from "./Pages/ListManager/ListDetail";




function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>
          <Route path="/tabledetails" element={<Itemtabledetails/>}/>
          <Route path="/useitem" element={<UseItem/>}/>
          <Route path="/grocerylist" element={<Addlist/>}/>
          <Route path="/inventory" element={<Inventory/>}/>
          <Route path="/specialfuncion" element={<Specialfuction/>}/>
          <Route path="/itemtable" element={<ItemTable/>}/>
          <Route path="/additem" element={<Additem/>}/>
          <Route path="/itemtable/:id" element={<EditItem/>}/>
          <Route path="/viewgrocerylist" element={<Viewlist/>}/>
          <Route path="/update-item/:id" element={<Updatelist />} />
          <Route path="/list/:id" element={<ListDetail />} /> 
          
        </Routes>
      </React.Fragment>
    </div> 
  )
}

export default App
