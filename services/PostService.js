import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Student from '../models/Student';

import { AppError } from '../utils/errorHandler';

const getPost = async(postId) => {
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400,'Invalid :postId parameter');
    return post;
}

const getPosts = async(page, userID) => {
    const user = await Student.findById(userID);
    const friendsIDs = user.friends;

    const posts = await Post
                            .find({ author: { $in : friendsIDs}  })
                            .sort({ timestamp: -1 })
                            .skip((page-1)*15)
                            .limit(15); 
    return posts;
}

const createPost = async(postObj) => {
    const newPost = new Post({...postObj});
    
    newPost.save()
        .then(savePostResult => {
            return savePostResult;
        })
        .catch((err) => console.log(err))
}

const updatePost = async(postId,newPostObj) => {
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400, 'Invalid :postId parameter');

    const updatePost = await Post.updateOne({_id: postId}, {
        ...newPostObj
    });

    if(updatePost.modifiedCount === 1) {
        return 'Post modified successfully'
    } else {
        throw new AppError(500, "Post couldn't be modified");
    }
}

const deletePost = async(postId) => { // Does it remove the post from the user?
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400,' Invalid :postId parameter');

    const result = await Post.findByIdAndRemove(postId);
    return result;
}

const likePost = async(userId, postId) => {
    const result = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    return result;
}

const unLikePost = async(userId, postId) => { // Does it remove the like from user?
    const result = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    return result;
}

const addCommentToPost = async(postId, commentObj) => {
    const comment = new Comment({...commentObj});
    const commentResult = comment.save();
    const result = await Post.findByIdAndUpdate(postId, { $push: { comments: new mongoose.Types.ObjectId(commentResult._id) } });
    return result;
}

const deleteCommentFromPost = async(postId, commentId) => { // Does it remove comment from user?
    const result = await Post.findByIdAndUpdate(postId, { $pull: { commentId }});
    return result;
}
    

export { getPost, getPosts, createPost, updatePost, likePost, unLikePost, deletePost, addCommentToPost, deleteCommentFromPost};

// Continue testing the user posting , then test the redirectio when loggin in and the regestring is missing some fields