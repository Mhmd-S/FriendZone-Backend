import express from "express";
import * as StudentController from "../controllers/StudentController";

const router = express.Router();

// router.get("/logout", logout);
// router.get("/user", getUser);

router.post("/register", StudentController.createStudent);
router.post("/login", StudentController.login);

router.put("/profile-picture", StudentController.updateProfilePicture);

router.put("/freindRequest", StudentController.requestFriend);
router.put("/friendAccept", StudentController.acceptFriend);

export default router;


