import express from "express";
import * as StudentController from "../controllers/StudentController";

const router = express.Router();

// router.get("/logout", logout);
// router.get("/user", getUser);

router.post("/register", StudentController.createStudent);
router.post("/login", StudentController.login);

export default router;

