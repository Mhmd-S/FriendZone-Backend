import mongoose from "mongoose";

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    phoneNumber:{
        type: Number,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    academics: {
        type: [Schema.Types.ObjectId],
        ref: "Academic",
    },
    persoalStatement: {
        type: String,
        default: "",
    },  
}, { timestamps: true })

const Student = mongoose.model("Student", StudentSchema);
export default Student; 