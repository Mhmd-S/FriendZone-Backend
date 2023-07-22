import express from "express";
import * as PostController from "../controllers/PostController";
import checkAuth from '../authentication/checkAuth';
import Post from "../models/Post";

let router = express.Router();

// Delete a post

router.get('/search', PostController.searchPosts);

// Get  a certain amount of posts
router.get('/posts', PostController.getPosts);

// Get a certain post using its id
router.get('/:postId', PostController.getPost);

// Create a post
router.post('/create-post', checkAuth, PostController.createPost);

// Like a post
router.put('/like/:postId', checkAuth, PostController.likePost);

// Unlike a post 
router.delete('/unlike/:postId', checkAuth, PostController.unLikePost);

// // To be added to frontend
// // Update a post
// router.put('/:postId', checkAuth, PostController.updatePost);
router.delete('/:postId', checkAuth, PostController.deletePost );

// Comment router. Will move it later

export default router;