import express from "express";
import * as StudentController from "../controllers/StudentController";

const router = express.Router();

// router.get("/logout", logout);

router.get("/getStudent", StudentController.getStudent);

router.post("/register", StudentController.createStudent);
router.post("/login", StudentController.login);

router.put("/profile-picture", StudentController.updateProfilePicture);
router.put("/friendRequest", StudentController.requestFriend);
router.put("/friendAccept", StudentController.acceptFriend);

router.delete("/:studentId", StudentController.deleteStudent);

export default router;


