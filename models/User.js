import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
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
    friends: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    pendingRequests: { // Friends that recieved a friend request from user
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    pendingFriends: { // Friends that are waiting for the user's confirmation
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