import express from "express";
import * as UserController from "../controllers/UserController";

// Dont forget to add protection to the routes
let router = express.Router();

router.get("/get-user", UserController.getUser);
router.get("/get-user-friends", UserController.getUserFriends);
router.get("/search", UserController.searchUsers);
router.get("/auth", UserController.authStatus);

router.post("/signup", UserController.createUser);
router.post("/login", UserController.login);

router.put("/update-info", UserController.updateProfile);
router.put("/friend-request", UserController.requestFriend);
router.put("/friend-accept", UserController.acceptFriend);

router.delete("/friend-reject", UserController.rejectFriend);
router.delete("/friend-remove", UserController.removeFriend);
router.delete("/logout", UserController.logout);
router.delete("/:userId", UserController.deleteUser);

export default router;



