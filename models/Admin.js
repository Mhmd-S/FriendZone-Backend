import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    email:{
        type: String,
        required: true    
    },
    password:{
        type: String,
        required: true
    },
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    }
}, { timestamps: true });


export const Admin = mongoose.model("Admin", AdminSchema);