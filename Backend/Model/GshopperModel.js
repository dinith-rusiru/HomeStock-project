//GshopperModel => Grocery shopper model file

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gshopperSchema = new Schema({
    name:{
        type:String, //datatype
        required:true,
         //validate


         
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
    },
    // // CHANGE: Made usagedate optional to handle both inventory items and usage records
    // usagedate: {
    //     type: Date,
    //     required: false, // Changed from true to false
    // },
    // // CHANGE: Made notes optional
    // notes: {
    //     type: String,
    //     required: false,
    // }
});

module.exports = mongoose.model(
    "GshopperModel", //model class file name
    gshopperSchema //function name
)