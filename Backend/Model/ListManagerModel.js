const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const glistSchema = new Schema({
    Item_name:{
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
     
     
});

module.exports = mongoose.model(
    "ListManagerModel", //model class file name
    glistSchema //function name
)