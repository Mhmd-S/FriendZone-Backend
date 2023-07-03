import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import mongoose from 'mongoose';
import * as CommentService from '../services/CommentService';

import Post from '../models/Post'
import Comment from '../models/Comment'

export const getComment = async(req,res,next) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) {
            throw new AppError(400, 'Invalid commentId query');
        }
        const result = await CommentService.getComment(commentId);
        res.json({ status: 'success', data: result });
    } catch (err) {
        next(err);
    }
}

export const getComments = async(req,res,next) => { // TEST THISSS
    try {
        const page = req.query.page;
        
        const postId = req.query.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) throw new AppError(400, 'Invalid id query')
        
        if (!page || Number.isInteger(page) || page <= 0) throw new AppError(400, 'Invalid ?page value');

        const comments = await CommentService.getComments(page, postId); 

        res.status(200).json({status:"success", data: comments});
    } catch (err) {
        next(err);
    }
}

export const addComment = [
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

            const data = await CommentService.addComment(postId, commentObj)

            res.json({ status: "success", data: data});
            
        } catch(err) {
            next(err);
        }        
    }
]

export const deleteComment = async(req,res,next) => {
    try {
        const commentId = req.params.commentId;

        if (!commentId) {
            throw new AppError(400, "Invalid :commentId parameter")
        }

        const comment = await CommentService.getComment(commentId);

        if (!comment) {
            throw new AppError(400, "Invalid :commentId paramter")
        }
        console.log(comment.author , req.user._id)
        if (comment.author.toString() !== req.user._id.toString()) {
            throw new AppError(401, "Unauthorized to delete comment!")
        }

        const data = await CommentService.deleteComment(commentId);

        res.json({ status: "success", data: null })
    } catch (err) {
        next(err);
    }
}


export const likeComment = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;

        if (!commentId) {
            throw new AppError(400, "invalid :postId paramter or :commentId")
        }

        const result = await CommentService.likeComment(commentId, userId);

        res.json({ status: "success", data: null});
    } catch(err) {
        next(err);
    }
}

export const unlikeComment = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;

        if (!commentId) {
            throw new AppError(400, "invalid :postId paramter or :commentId")
        }

        const result = await CommentService.unlikeComment(commentId, userId);

        res.json({ status: "success", data: null});
    } catch(err) {
        next(err);
    }
}