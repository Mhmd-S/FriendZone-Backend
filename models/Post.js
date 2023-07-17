import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'User'
    },
    comments: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Comment'
    },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post; 