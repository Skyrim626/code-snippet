import { login, register, me, logout } from "../controllers/authController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/logout", protect, logout);

export default router;
