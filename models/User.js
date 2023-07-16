import mongoose, { SchemaTypeOptions } from "mongoose";

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
    friends: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    pendingRequests: { // Friends that recieved a friend request from user
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    pendingFriends: { // Friends that are waiting for the user's confirmation
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    likedPosts : {
        type: [Schema.Types.ObjectId],
        ref:"Post",
        default: [],
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Post",
        default: [],
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
        default: null
    }, 
    profileHeader: {
        type: String,
        defualt: null
    }, 
    bio: {
        type: String,
        default:''
    }
}, { timestamps: true })

const User = mongoose.model("User", UserSchema);
export default User;