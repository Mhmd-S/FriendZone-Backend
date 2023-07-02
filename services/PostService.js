import mongoose from 'mongoose';
import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';

import { AppError } from '../utils/errorHandler';

const getPost = async(postId) => {
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400,'Invalid :postId parameter');
    return post;
}

const getPosts = async (page, userId) => {
  let posts;
  if (userId) {
    const user = await User.findById(userId).exec();
    const friendsIds = user.friends;
    posts = await Post.find({ author: { $in: [...friendsIds, userId] } })
      .populate('author', 'username')
      .sort({ timestamp: 1 })
      .skip((page - 1) * 15)
      .limit(15)
      .exec();
  } else {
    posts = await Post.find()
      .populate('author', 'username')
      .sort({ timestamp: 1, likes: -1 })
      .skip((page - 1) * 15)
      .limit(15)
      .exec();
  }
  return posts;
};

const getComments = async (page, postId) => { // fix this

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

const createPost = async(postObj) => {
    const newPost = new Post({...postObj});
    
    newPost.save()
        .then(savePostResult => {
            User.findByIdAndUpdate(postObj.author, { $push: { posts: savePostResult._id } })
                .then(addPostToUserResult => { return{savePostResult, addPostToUserResult} })
                .catch(err => console.log(err))
            return savePostResult;
        })
        .catch((err) => console.log(err))
}

const updatePost = async(postId,newPostObj) => {
    const post = await Post.findById(postId).exec();
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
    const post = await Post.findById(postId).exec();
    if (post === null) throw new AppError(400,' Invalid :postId parameter');

    const result = await Post.findByIdAndRemove(postId);
    return result;
}

const likePost = async(userId, postId) => {
    const result = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } }).exec();
    const resultUser = await Post.findByIdAndUpdate(userId, { $push: { likedPosts: postId }}).exec();
    return {result, resultUser};
}

const unLikePost = async(userId, postId) => { // Does it remove the like from user?
    const result = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    const resultUser = await Post.findByIdAndUpdate(userId, { $pull: { likedPosts: postId }}).exec();
    return result;
}

const addCommentToPost = async(postId, commentObj) => {
    const comment = new Comment({...commentObj});
    const commentResult = await comment.save();
    const result = await Post.findByIdAndUpdate(postId, { $push: { comments: commentResult._id  } }).exec();
    const resultUser = await Post.findByIdAndUpdate(commentObj.author, { $push: { commentedPosts : commentResult._id }}).exec();
    return result;
}

const deleteCommentFromPost = async(postId, commentId) => { // Does it remove comment from user?
    const result = await Post.findByIdAndUpdate(postId, { $pull: { commentId }});
    const resultUser = await Post.findByIdAndUpdate(commentId.author, { $pull: { commentedPosts : commentResult._id }}).exec();

    return result;
}
    

export { getPost, getPosts, getComments, createPost, updatePost, likePost, unLikePost, deletePost, addCommentToPost, deleteCommentFromPost};

// Continue testing the user posting , then test the redirectio when loggin in and the regestring is missing some fields