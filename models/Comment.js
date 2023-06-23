import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Student',
    }
}, { timestamps: true })


const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;