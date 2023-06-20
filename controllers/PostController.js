import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import * as postService from '../services/PostService';

const getPost = async(req,res,next) => {
    try {
        const postId = req.params.postId;
        if (!postId) throw new AppError(400, 'Invalid :postId parameter');
        const post = await postService.getPost(postId);
        res.status(200).json({status:"OK", result: post })
    } catch (err) {
        next(err);
    }
}

// const getPosts = async(req,res,next) => {
// }

const createPost = [
    body('content')
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
                author: req.userId, // Recieved when verifying the cookies
            }

            const post = await postService.createPost(postInfo);
            res.status(200).json({status: "OK", result: post});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
]

const likePost = async(req,res,next) => {
    try{
        const userId = req.user._id;
        const postId = req.params.postId;
        const result = await PostService.likePost(userId, postId);
    } catch(err) {
        next(err);
    }
}

const updatePost = [
    body('content')
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

            const postResult = await postService.updatePost(postId, newPostInfo);
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
            const deleteResult = await postService.deletePost(postId);
            res.status(200).json({ status:"OK", result: deleteResult})
        }catch (err) {
            next(err);
        }
    }
]

export { getPost, createPost, updatePost, deletePost };
