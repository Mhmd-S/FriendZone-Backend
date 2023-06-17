import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Student'
    }
})

const PostSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'Student'
    },
    comments: {
        type: [CommentSchema],
        ref: 'Comment'
    },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post; 