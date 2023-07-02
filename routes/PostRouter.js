import express from "express";
import * as PostController from "../controllers/PostController";
import checkAuth from '../authentication/checkAuth';
import Post from "../models/Post";

let router = express.Router();

// Get  a certain amount of posts
router.get('/posts', PostController.getPosts);

// Get a certain amount of comments from a post
router.get('/comments', PostController.getComments);

// Get a certain post using its id
router.get('/:postId', PostController.getPost);

// Create a post
router.post('/create-post', checkAuth, PostController.createPost);

// Like a post
router.put('/like/:postId', checkAuth, PostController.likePost);

// Unlike a post
router.put('/unLike/:postId', checkAuth, PostController.unLikePost);

// Add a comment to post
router.put('/comment/:postId', checkAuth, PostController.addCommentToPost);

// Update a post
router.put('/:postId', checkAuth, PostController.updatePost);

// Delete a post
router.delete('/:postId', checkAuth, PostController.deletePost );

// Delete a comment to post
router.delete('/comment/:postId/:commentId', checkAuth, PostController.deleteCommentFromPost);
            
export default router;