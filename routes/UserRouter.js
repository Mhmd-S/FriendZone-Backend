import express from "express";
import * as UserController from "../controllers/UserController";
import checkAuth from "../authentication/checkAuth";

let router = express.Router();

router.get("/getUser", UserController.getUser);
router.get("/search", UserController.searchUsers);
router.get("/auth", UserController.authStatus);

router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.put("/profile-picture", UserController.updateProfilePicture);
router.put("/friendRequest", UserController.requestFriend);
router.put("/friendAccept", UserController.acceptFriend);

router.delete("/logout", UserController.logout);
router.delete("/:userId", UserController.deleteUser);

export default router;



