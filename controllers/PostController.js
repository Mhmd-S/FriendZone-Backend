import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/errorHandler';
import * as PostService from '../services/PostService';
import formidable from 'formidable';
import path from  'path';
import { uploadImage } from '../uploadio/uploadio_API';

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
        const limit = req.query.limit;
        
        if (!searchQuery) throw new AppError(400, 'Invalid ?search value');
        if (!page || Number.isInteger(page) || page <= 0) throw new AppError(400, 'Invalid ?page value');
        if (!limit || Number.isInteger(limit) || page <= 0 || page > 15) throw new AppError(400, 'Invalid ?limit value');

        const posts = await PostService.searchPosts(searchQuery, limit, page);

        res.status(200).json({status:"success", data: posts })
    } catch (err) {
        next(err);
    }
}

export const getPosts = async(req,res,next) => {
    try {
        const page = req.query.page;
        const userID = req.user?._id ? req.user._id : null;
        if (!page) throw new AppError(400, 'Invalid ?page value');
        const posts = await PostService.getPosts(page, userID); 
        res.status(200).json({status:"success", data: posts});
    } catch (err) {
        next(err);
    }
}

export const createPost = [
  body('content')
    .exists().withMessage('Content field is required!')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('Content size should be at least 1 character and a maximum of 500')
    .escape(),
  async (req, res, next) => {
    try {
      const form = formidable({
        uploadDir: path.resolve(__dirname, '..', 'uploads'),
        keepExtensions: true,
      });
      form.parse(req, async (err, fields, files) => {
        if (err) {
            next(new AppError(500, "Could not upload post"))
            return;
        }

        let url = '';
        
        // Validate the postImage field if an image is available
        if (files?.postImage) {
            const imageFile = files.postImage;
            if (!Array.isArray(imageFile) || imageFile.length !== 1) {
                next(new AppError(400, 'Only one image file allowed'));
                return
            }

            // Check if the uploaded file is an image
            const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            console.log(imageFile)
            if (!acceptedFileTypes.includes(imageFile[0].mimetype)) {
                next(new AppError(400, 'Only image files are allowed'));
                return;
            }

            url = await uploadImage(imageFile[0], '/post_images');
        }
        
        const postInfo = {
          content: fields.content[0],
          image: url,
          author: req.user._id,
        }

        const post = await PostService.createPost(postInfo);
        return res.status(200).json({ status: "success", data: post });
      });
    } catch (err) {
      next(err);
    }
  }
];



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

export const deletePost = async(req,res,next) => {
        try {
            console.log(123)
            const postId = req.params.postId;
            
            // Verify user's owner of post
            const post = await PostService.getPost(postId);

            if (!post) {
                next(new AppError(400, 'Invalid :postId paramter'))
            }

            if (post.author.username !== req.user.username) {
                next(new AppError(400,'Unauthorized action'));
            }

            await PostService.deletePost(req.user._id, postId);
            res.status(200).json({ status:"success", data: null})
        }catch (err) {
            next(err);
        }
    }


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

