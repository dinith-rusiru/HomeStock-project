import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
// import Itemtabledetails from './Pages/GroceryShopper/Itemtabledetails';
import ItemTable from "./Pages/GroceryShopper/Itemtable";
import UsageTable from './Pages/FamilyMember/Usagetable' 
import Listcreate from "./Pages/ListManager/Addlist";
import Inventory from "./Pages/Inventory/Inventory";
import Specialfuction from "./Pages/SpecialFunction/specialfuction";
import Additem from "./Pages/GroceryShopper/Additem";
import EditItem from "./Pages/GroceryShopper/Edititem";
import Addusage from "./Pages/FamilyMember/Addusage";
// import Usagetableupdatedel from "./Pages/FamilyMember/Usagetableupdatedel"
import Sign from "./Pages/signup";
import Login from "./Pages/login";
import Editusage from "./Pages/FamilyMember/Editusage";
import Viewlist from "./Pages/ListManager/Viewlist";
import Updatelist from "./Pages/ListManager/Updatelist";
import Addlist from "./Pages/ListManager/Addlist";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>
          {/* <Route path="/tabledetails" element={<Itemtabledetails/>}/> */}
          <Route path="/usagetable" element={<UsageTable/>}/>
          <Route path="/grocerylist" element={<Addlist/>}/>
          <Route path="/inventory" element={<Inventory/>}/>
          <Route path="/specialfuncion" element={<Specialfuction/>}/>
          <Route path="/itemtable" element={<ItemTable/>}/>
          <Route path="/additem" element={<Additem/>}/>
          <Route path="/itemtable/:id" element={<EditItem/>}/>
          <Route path="/addusage" element={<Addusage/>}/>
          {/* <Route path="/usagetableupdatedel" element={<Usagetableupdatedel/>}/> */}
          <Route path="/editusage/:id" element={<Editusage/>}/>
          <Route path="/viewgrocerylist" element={<Viewlist/>}/>
          <Route path="/update-item/:id" element={<Updatelist />} />


          <Route path="/Sign" element={<Sign/>}/>
          <Route path="/sign-up" element={<Login/>}/>
        </Routes>
      </React.Fragment>
    </div> 
  )
}

export default App
