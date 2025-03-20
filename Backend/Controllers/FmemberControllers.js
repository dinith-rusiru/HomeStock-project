// FmemberControllers.js - Fixed version

// Fix #1: Changed variable name to match import case
const User = require("../Model/FmemberModel");

//get users
const getAlllUsers = async (req, res, next) => {
    let users;
    //get all users
    try{
        users = await User.find();
    }catch (err) {
        console.log(err);
    }
    //not found
    if (!users){
        return res.status(400).json({message:"User not found"});
    }
    //Display all users
    return res.status(200).json({users});
};

//data insert
const addUsers = async (req, res, next) => {
   const { name, qty, category, importantlevel, expdate, usagedate, notes } = req.body; 

   let user;

   try{
    // CHANGE: Modified to handle both inventory items and usage records
    user = new User({
        name, 
        qty, 
        category,
        // CHANGE: If importantlevel is provided, use it; otherwise, set default
        importantlevel: importantlevel || 1,
        // CHANGE: If expdate is provided, use it; otherwise, set default
        expdate: expdate || new Date().toISOString().split('T')[0],
        // CHANGE: If usagedate is provided, include it (for usage records)
        ...(usagedate && { usagedate }),
        // CHANGE: If notes are provided, include them
        ...(notes && { notes })
    });
    await user.save();
   }catch (err) {
    // CHANGE: Added better error handling
    console.log(err);
    return res.status(500).json({message:"Error adding user", error: err.message});
   }
   //not insert users
   if (!user){
    return res.status(404).json({message:"unable to add users"});
   }
   return res.status(200).json({ user }
   );
};

//Get by ID
const getById = async (req, res, next) => {
    const id = req.params.id;
    let user;

    try{
        user = await User.findById(id);
    }catch (err){
        console.log(err);
    }

    //not available users
   if (!user){
    return res.status(404).json({message:"User not found"});
   }
   return res.status(200).json({ user }
   );
};

//Update user details
const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, qty, category, importantlevel, expdate, usagedate, notes } = req.body;

    let users;

    try {
        // CHANGE: Build update object with provided fields
        const updateObj = {};
        if (name !== undefined) updateObj.name = name;
        if (qty !== undefined) updateObj.qty = qty;
        if (category !== undefined) updateObj.category = category;
        if (importantlevel !== undefined) updateObj.importantlevel = importantlevel;
        if (expdate !== undefined) updateObj.expdate = expdate;
        if (usagedate !== undefined) updateObj.usagedate = usagedate;
        if (notes !== undefined) updateObj.notes = notes;

        users = await User.findByIdAndUpdate(id, updateObj, { new: true });
    }catch(err) {
        // CHANGE: Added better error handling
        console.log(err);
        return res.status(500).json({message:"Error updating user", error: err.message});
    }

     //not available users
   if (!users){
    return res.status(404).json({message:"Unable to update"});
   }
   return res.status(200).json({ users }
   );
};

//Delete user
const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;

    try{
        user = await User.findByIdAndDelete(id)
    }catch (err) {
        console.log(err);
    }

     //not available users
   if (!user){
    return res.status(404).json({message:"Unable to delete"});
   }
   return res.status(200).json({ user }
   );
}

exports.getAlllUsers = getAlllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;