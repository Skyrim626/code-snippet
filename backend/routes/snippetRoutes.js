import {
  createSnippet,
  deleteSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
} from "../controllers/snippetController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  validateCreateSnippet,
  validateUpdateSnippet,
} from "../utils/validators/snippetValidator.js";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validateCreateSnippet,
  validateRequest,
  createSnippet
);
router.get("/", protect, getAllSnippets);
router.get("/:id", protect, getSnippetById);
router.put(
  "/:id",
  protect,
  validateUpdateSnippet,
  validateRequest,
  updateSnippet
);
router.delete("/:id", protect, deleteSnippet);

export default router;
