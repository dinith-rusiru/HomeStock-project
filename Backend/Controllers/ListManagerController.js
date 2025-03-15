//ListManagerController => List Manager Controller file

const List = require("../Model/ListManagerModel");

//data display function

const getAllLists = async(req,res,next) =>{
    let Lists; //variable asinging

    //get all gshoppers
    try{
        lists = await getlist.find();
    }catch(err){
        console.log(err);
    }

    //not found 
    if(!lists){
        return res.status(404).json({message:"Grocery lists are not found "});         
    };

    //Display all gshoppers
    return res.status(200).json({lists});
};

//data insert
const addgshopper = async(req, res, next) => {
    const{name,qty,category,importantlevel,expdate} = req.body;

    try{
        gshoppers = new Gshopper({name,qty,category,importantlevel,expdate});
        await gshoppers.save();;
    }catch(err){
        console.log(err);
    }

    //not insert gshopper
    if(!gshoppers){
        return res.status(404).json({message:"unable to add grocery shopppers"});
    }
    return res.status(200).json({gshoppers});
};

//GET BY ID 
const getById = async(req,res,next) => {
    const id = req.params.id;

    let gshopper;
    
    try{
        gshopper = await Gshopper.findById(id);
    }catch(err){
        console.log(err);
    }
    //not available gshopper
    if(!gshopper){
        return res.status(404).json({message:"grocery shoppper not found"});
    }
    return res.status(200).json({gshopper});
};

//update gshopper details
const updategshopper =  async (req,res,next) => {
    const id = req.params.id;
    const{name,qty,category,importantlevel,expdate} = req.body;

    let gshoppers;

    try{
        gshoppers = await Gshopper.findByIdAndUpdate(id,
            {name:name, qty:qty, importantlevel:importantlevel, expdate:expdate});
            gshoppers = await gshoppers.save();
    }catch(err){
        console.log(err);
    }
    //unable to update groccery shopper
    if(!gshoppers){
        return res.status(404).json({message:"Unable to update Grocery shopper details"});
    }
    return res.status(200).json({gshoppers});
};

//Delete gshopper
const deletegshopper = async (req,res,next) => {
    const id = req.params.id;

    let gshopper;

    try{
        gshopper = await Gshopper.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }
    
    //unable to delete grocery shopper
    if(!gshopper){
        return res.status(404).json({message:"Unable to Delete Grocery shopper details"});
    }
    return res.status(200).json({gshopper});
};

exports.getAllLists = getAllLists; //exports using function name
exports.addgshopper = addgshopper; 
exports.getById = getById; 
exports.updategshopper = updategshopper;
exports.deletegshopper = deletegshopper;