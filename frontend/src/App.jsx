import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Itemtabledetails from './Pages/GroceryShopper/Itemtabledetails';
import ItemTable from "./Pages/GroceryShopper/Itemtable";
import UsageTable from './Pages/FamilyMember/Usagetable' 
import Listcreate from "./Pages/ListManager/listcreate";
import Inventory from "./Pages/Inventory/Inventory";
import Specialfuction from "./Pages/SpecialFunction/specialfuction";
import Additem from "./Pages/GroceryShopper/Additem";
import EditItem from "./Pages/GroceryShopper/Edititem";
import Addusage from "./Pages/FamilyMember/Addusage";
import Usagetableupdatedel from "./Pages/FamilyMember/Usagetableupdatedel"
import editusage from "./Pages/FamilyMember/Editusage";
import Editusage from "./Pages/FamilyMember/Editusage";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>
          <Route path="/tabledetails" element={<Itemtabledetails/>}/>
          <Route path="/usagetable" element={<UsageTable/>}/>
          <Route path="/grocerylist" element={<Listcreate/>}/>
          <Route path="/inventory" element={<Inventory/>}/>
          <Route path="/specialfuncion" element={<Specialfuction/>}/>
          <Route path="/itemtable" element={<ItemTable/>}/>
          <Route path="/additem" element={<Additem/>}/>
          <Route path="/itemtable/:id" element={<EditItem/>}/>
          <Route path="/addusage" element={<Addusage/>}/>
          <Route path="/usagetableupdatedel" element={<Usagetableupdatedel/>}/>
          <Route path="/editusage" element={<Editusage/>}/>
        </Routes>
      </React.Fragment>
    </div> 
  )
}

export default App
