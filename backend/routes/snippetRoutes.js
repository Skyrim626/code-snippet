import {
  createSnippet,
  getAllSnippets,
} from "../controllers/snippetController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new snippet
// POST /api/snippets
router.post("/", protect, createSnippet);
// Route to get all snippets
router.get("/", protect, getAllSnippets);

export default router;
