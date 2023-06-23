import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import * as PostService from '../services/PostService';

import Post from '../models/Post'
import Comment from '../models/Comment'

const getPost = async(req,res,next) => {
    try {
        const postId = req.params.postId;
        if (!postId) throw new AppError(400, 'Invalid :postId parameter');
        const post = await PostService.getPost(postId);
        res.status(200).json({status:"OK", result: post })
    } catch (err) {
        next(err);
    }
}

// const getPosts = async(req,res,next) => {
// }

const createPost = [
    body('content')
    .exists().withMessage('Content field is required')
    .trim()
    .isLength({ min:1, max: 1250 }).withMessage('Content size should be atleast 1 character and a maximum of 1250')
    .escape(),
    async(req,res,next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(400, errors.array());
            }

            const postInfo = {
                content: req.body.content,
                author: req.user._id, // Recieved when verifying the cookies
            }

            const post = await PostService.createPost(postInfo);
            res.status(200).json({status: "OK", result: post});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
]

const updatePost = [
    body('content')
    .exists().withMessage('Content field is required')
    .trim()
    .isLength({ min:1, max: 1250 }).withMessage('Content size should be atleast 1 character and a maximum of 1250')
    .escape(),
    async(req,res,next) => {
        try{
            const postId = req.params.postId;
            if (!postId) throw new AppError(400,'Invalid :postId parameter');

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new AppError(400, errors.array());
            }

            const newPostInfo = {
                content: req.body.content,
                author: req.userId, // Recieved when verifying the cookies
            }

            const postResult = await PostService.updatePost(postId, newPostInfo);
            res.status(200).json({ status:"OK", result: postResult });
        } catch(err) {
            console.log(err);
            next(err);
        }
    }
]

const deletePost = [
    async(req,res,next) => {
        try {
            const postId = req.params.postId;
            if (!postId) throw new AppError(400,'Invalid :postId parameter');
            const deleteResult = await PostService.deletePost(postId);
            res.status(200).json({ status:"OK", result: deleteResult})
        }catch (err) {
            next(err);
        }
    }
]

const likePost = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const postId = req.params.postId;

        if (!userId || !postId) throw new AppError(400, "Invalid :postId paramter or No user ID found")

        const result = PostService.likePost(userId, postId);
        res.json({ status: "OK", result: "Post liked successfully" })
    } catch(err) {
        next(err);
    }
}

const unLikePost = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const postId = req.params.postId;

        if (!userId || !postId) throw new AppError(400, "Invalid :postId paramter or No user ID found")

        const result = PostService.unLikePost(userId, postId);
        res.json({ status: "OK", result: "Post unliked successfully" })
    } catch(err) {
        next(err);
    }
}

const addCommentToPost = [
    body('content')
    .exists().withMessage('Content field is required')
    .trim()
    .isLength({ min:1, max: 1250 }).withMessage('Content size should be atleast 1 character and a maximum of 1250')
    .escape(),
    async(req,res,next) => {
        try{
            const postId = req.params.postId;

            const post = await Post.findById(postId);
            
            if (!post) throw new AppError(400, "Invalid :postId parameter");

            const commentObj = { // Something wrong here
                author: req.user._id,
                content: req.body.content,    
            };

            const result = await PostService.addCommentToPost(postId, commentObj)

            res.json({ status: "OK", result: "Comment added successfully", comment: result.content});
            
        } catch(err) {
            next(err);
        }        
    }
]

const deleteCommentFromPost = async(req,res,next) => {
    try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!postId || !commentId) {
        throw new AppError(400, "invalid :postId paramter or :commentId")
    }

    const result = PostService.deleteCommentFromPost(postId, commentId);

    } catch (err) {
        next(err);
    }
}

export { getPost, createPost, updatePost, deletePost, likePost, unLikePost, addCommentToPost, deleteCommentFromPost };