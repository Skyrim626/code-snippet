import { body } from "express-validator";

export const validateCreateSnippet = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("code").notEmpty().withMessage("Code is required"),
  body("programmingLanguage")
    .notEmpty()
    .withMessage("Programming language is required"),
];

export const validateUpdateSnippet = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters"),
  body("code").optional().notEmpty().withMessage("Code is required"),
  body("programmingLanguage")
    .optional()
    .notEmpty()
    .withMessage("Programming language is required"),
];
