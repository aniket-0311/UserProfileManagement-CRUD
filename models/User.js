
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    middleName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true,
        enum:['ADMIN','USER'],
        default:'USER'
    },
    department:{
        type:String,
        default:""
    }
},{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);