//GshopperModel => Grocery shopper model file

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gshopperSchema = new Schema({
    name:{
        type:String, //datatype
        required:true, //validate
    },
    qty:{
        type:Number, //datatype
        required:true, //validate
    }, 
    category:{
        type:String, //datatype
        required:true, //validate
    }, 
    importantlevel:{
        type:Number, //datatype
        required:true, //validate
    }, 
    expdate:{
        type:Date, //datatype
        required:true, //validate
    } 
});

module.exports = mongoose.model(
    "GshopperModel", //model class file name
    gshopperSchema //function name
)