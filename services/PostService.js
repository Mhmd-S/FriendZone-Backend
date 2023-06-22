import {Post, Comment} from '../models/Post';

import { AppError } from '../utils/errorHandler';

const getPost = async(postId) => {
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400,'Invalid :postId parameter');
    return post;
}

const getPosts = async(page) => {
    const posts = await Post.find({}).sort({ date: 'desc' }).skip((page-1)*7).limit(7);
    return posts;
}

const createPost = async(postObj) => {
    const newPost = new Post({...postObj});
    newPost.save()
        .then(savePostResult => {
            return savePostResult;
        })
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

const deletePost = async(postId) => {
    const post = await Post.findById(postId).populate('comments').exec();
    if (post === null) throw new AppError(400,' Invalid :postId parameter');

    const result = await Post.findByIdAndRemove(postId);
    return result;
}

const likePost = async(userId, postId) => {
    const result = await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
    return result;
}

const unLikePost = async(userId, postId) => {
    const result = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    return result;
}

const addCommentToPost = async(postId, commentObj) => {
    const result = await Post.findByIdAndUpdate(postId, { $push: { commentObj } });
    return result;
}

const deleteCommentFromPost = async(postId, commentId) => {
    const result = await Post.findByIdAndUpdate(postId, { $pull: { commentId }});
    return result;
}
    

export { getPost, getPosts, createPost, updatePost, likePost, unLikePost, deletePost, addCommentToPost, deleteCommentFromPost };