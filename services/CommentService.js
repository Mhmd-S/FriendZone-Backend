import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';

export const getComment = async(commentId) => {
    const result = await Comment.findById(commentId).exec();
    return result;
}

export const getComments = async (page, postId) => { // fix this
    console.log(page, postId)
    const comments =  await Post.findById(postId, 'comments')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username'
            }
        })
        .sort({ timestamp: 1 })
        .skip((page - 1) * 15)
        .limit(15)
        .exec();
    return comments;
}

export const likeComment = async(commentId, userId) => {
    const result = await Comment.findByIdAndUpdate(commentId, { $push: userId}).exec();
    return result;
}

export const unlikeComment = async(commentId, userId) => {
    const result = await Comment.findByIdAndUpdate(commentId, { $pull: userId }).exec();
    return result;
}
    
export const addComment = async(postId, commentObj) => {
    const comment = new Comment({...commentObj});
    const commentResult = await comment.save();
    const result = await Post.findByIdAndUpdate(postId, { $push: { comments: commentResult._id  } }).exec();
    const resultUser = await User.findByIdAndUpdate(commentObj.author, { $push: { commentedPosts : commentResult._id }}).exec();
    return result;
}

export const deleteComment = async(commentId) => { // Does it remove comment from user?
    const deleteCommentRes = Comment.findByIdAndDelete(commentId).exec();
    const deleteCommentFromPostRes = Post.findOneAndUpdate({ comments: { $in: commentId} }, { $pull : { comments : commentId }}).exec();
    const deleteFromUser = User.findOneAndUpdate({ commentedPosts: { $in: commentId }}, { $pull : { comments: commentId }}).exec();
    return { deleteCommentRes, deleteCommentFromPostRes, deleteFromUser };
}