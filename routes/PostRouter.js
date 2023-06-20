import express from "express";
import * as PostController from "../controllers/PostController";

let router = express.Router();

// Get a certain post using its id
router.get('/:postId', PostController.getPost);

// Get all a certain amount of posts
// router.get('/', PostController.getPosts);

// Create a post
router.post('/create-post', PostController.createPost);

// Like a post
router.put('/like/:postId', PostController.likePost);

// Unlike a post
router.put('/unLike/:postId', PostController.unLikePost);

// Add a comment to post
router.put('/comment/:postId', PostController.addCommentToPost);

// Delete a comment to post
router.put('/comment/:postId', PostController.deleteCommentFromPost);

// Update a post
router.put('/:postId', PostController.updatePost);

// Delete a post
router.delete('/:postId', PostController.deletePost );
            
export default router;