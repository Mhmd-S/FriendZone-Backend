import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
        ref: "User",
        default: []
    },
    pendingRequests: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    pendingFriends: {
        type: [Schema.Types.ObjectId],
        ref: "User",
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

const User = mongoose.model("User", UserSchema);
export default User;