import express from "express";
import * as UserController from "../controllers/UserController";
import checkAuth from '../authentication/checkAuth';

// Dont forget to add protection to the routes
let router = express.Router();

router.get("/get-user",UserController.getUser);
router.get("/get-user-friends", UserController.getUserFriends);
router.get("/search", UserController.searchUsers);
router.get("/auth", UserController.authStatus);

router.post("/signup", UserController.createUser);
router.post("/login", UserController.login);

router.put("/update-info", checkAuth,UserController.updateProfile);
router.put("/friend-request", checkAuth,UserController.requestFriend);
router.put("/friend-accept", checkAuth,UserController.acceptFriend);

router.delete("/friend-reject", checkAuth,UserController.rejectFriend);
router.delete("/friend-remove",checkAuth, UserController.removeFriend);
router.delete("/logout", checkAuth,UserController.logout);
// router.delete("/:userId", checkAuth,UserController.deleteUser);

export default router;



