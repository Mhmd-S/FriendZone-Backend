import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    phone_number:{
        type: Number,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    preferred  
}, { timestamps: true })

export const Student = mongoose.model("Student", StudentSchema);