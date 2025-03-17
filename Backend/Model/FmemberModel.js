// FmemberModel.js => Family member model file

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fmemberSchema = new Schema({
    name: {
        type: String, // datatype
        required: true, // validate
    },
    qty: {
        type: Number, // datatype
        required: true, // validate
    },
    category: {
        type: String, // datatype
        required: true, // validate
    },
    importantlevel: {
        type: Number, // datatype
        required: false, // optional for usage records
    },
    expdate: {
        type: Date, // datatype
        required: false, // optional for usage records
    },
    usagedate: {
        type: Date, // datatype
        required: true, // required for usage records
    },
    notes: {
        type: String, // datatype
        required: false, // optional
    }
});

module.exports = mongoose.model(
    "FmemberModel", // model class file name
    fmemberSchema // function name
);