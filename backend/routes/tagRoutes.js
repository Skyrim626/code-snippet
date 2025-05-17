import express from "express";
import {
  validateCreateTag,
  validateUpdateTag,
} from "../utils/validators/tagValidator.js";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTagById,
  updateTag,
} from "../controllers/tagController";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/", protect, validateCreateTag, validateRequest, createTag);
router.get("/", protect, getAllTags);
router.get("/:id", protect, getTagById);
router.put("/:id", protect, validateUpdateTag, validateRequest, updateTag);
router.delete("/:id", protect, deleteTag);

export default router;
