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
    gender:{
        type: String,
        enum: ["male", "female"]
    },
    dob: {
        type: String,
        required: true,
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
        default: []
    },
    pendingRequests: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
        default: []
    },
    pendingFriends: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
        default: []
    },
    verified: {
        type: Boolean,
        default: false,
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: "Post",
        default:[]
    },
    profilePicture: {
        type: String,
    }, 
}, { timestamps: true })

const Student = mongoose.model("Student", StudentSchema);
export default Student;