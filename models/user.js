import mongoose from "mongoose";
import { Schema } from "mongoose";

const user = new mongoose.Schema({
    name: {
        type: String, 
        require: true,
     },
     email:{
        type: String,
        require: true,
        unique: true,
     },
     password:{
        type: String, 
        require: true,
     }
})

export const User = mongoose.model('user', user );