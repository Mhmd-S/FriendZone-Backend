import express from "express";
import * as CommentController from "../controllers/CommentController";
import checkAuth from '../authentication/checkAuth';

let router = express.Router();
// Fix all this shit!

router.get('/:commentId', CommentController.getComment);

// Get a certain amount of comments from a post
router.get('/post', CommentController.getComments); // I change the hing

// Add a comment
router.put('/:postId', checkAuth, CommentController.addComment);

// Like comment
router.put('/likes/:commentId', checkAuth, CommentController.likeComment);

// Unlike a comment
router.delete('/likes/:commentId', checkAuth, CommentController.unlikeComment)

// Delete a comment from post
router.delete('/:commentId', checkAuth, CommentController.deleteComment);
            
export default router;