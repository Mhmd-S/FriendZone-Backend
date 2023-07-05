import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import * as PostService from '../services/PostService';

import Post from '../models/Post'
import Comment from '../models/Comment'

export const getPost = async(req,res,next) => {
    try {
        const postId = req.params.postId;
        if (!postId) throw new AppError(400, 'Invalid :postId parameter');
        const post = await PostService.getPost(postId);
        res.status(200).json({status:"success", data: post })
    } catch (err) {
        next(err);
    }
}
export const searchPosts = async(req,res,next) => {
    try {
        const searchQuery = req.query.keywords;
        const page = req.query.page;
        
        if (!searchQuery) throw new AppError(400, 'Invalid ?search value');
        if (!page || Number.isInteger(page) || page <= 0) throw new AppError(400, 'Invalid ?page value');

        const posts = await PostService.searchPosts(searchQuery, page);

        res.status(200).json({status:"success", data: posts })
    } catch (err) {

    }
}

export const getPosts = async(req,res,next) => {
    try {
        const page = req.query.page;
        const userID = req.user?._id ? req.user._id : null;
        if (!page) throw new AppError(400, 'Invalid ?page value')
            const posts = await PostService.getPosts(page, userID); 
            res.status(200).json({status:"success", data: posts});
    } catch (err) {
        next(err);
    }
}

export const createPost = [
    body('content')
        .exists().withMessage('Content field is required')
        .trim()
        .isLength({ min:1, max: 1250 }).withMessage('Content size should be atleast 1 character and a maximum of 1250')
        .escape(),
    async(req,res,next) => {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorObject = { [errors.path]: errors.msg };
                return next(new AppError(400, errorObject));
            }

            const postInfo = {
                content: req.body.content,
                author: req.user._id,
            }

            const post = await PostService.createPost(postInfo);
            res.status(200).json({status: "success", data: post});
        } catch (err) {
            ;
            next(err);
        }
    }
]

export const updatePost = [
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
                author: req.userId, // Recieved when verifying the cosuccessies
            }

            const postdata = await PostService.updatePost(postId, newPostInfo);
            res.status(200).json({ status:"success", data: postdata });
        } catch(err) {
            next(err);
        }
    }
]

export const deletePost = [
    async(req,res,next) => {
        try {
            const postId = req.params.postId;
            if (!postId) throw new AppError(400,'Invalid :postId parameter');
            await PostService.deletePost(postId);
            res.status(200).json({ status:"success", data: null})
        }catch (err) {
            next(err);
        }
    }
]

export const likePost = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const postId = req.params.postId;

        if (!userId || !postId) throw new AppError(400, "Invalid :postId paramter or No user ID found")

        const data = PostService.likePost(userId, postId);
        res.json({ status: "success", data: null })
    } catch(err) {
        next(err);
    }
}

export const unLikePost = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const postId = req.params.postId;

        if (!userId || !postId) throw new AppError(400, "Invalid :postId paramter or No user ID found")

        const data = PostService.unLikePost(userId, postId);
        res.json({ status: "success", data: null })
    } catch(err) {
        next(err);
    }
}