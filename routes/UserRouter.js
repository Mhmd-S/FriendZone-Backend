import express from "express";
import * as UserController from "../controllers/UserController";

let router = express.Router();

// router.get("/logout", logout);

router.get("/getUser", UserController.getUser);

router.post("/register", UserController.createUser);
router.post("/login", UserController.login);

router.put("/profile-picture", UserController.updateProfilePicture);
router.put("/friendRequest", UserController.requestFriend);
router.put("/friendAccept", UserController.acceptFriend);

router.delete("/:userId", UserController.deleteUser);

export default router;


