import { body } from "express-validator";

export const validateCreateTag = [
  body("name")
    .notEmpty()
    .withMessage("Tag name is required")
    .isLength({ max: 50 })
    .withMessage("Tag name must be at most 50 characters"),
  body("color")
    .optional()
    .isHexColor()
    .withMessage("Color must be a valid hex color code"),
];

export const validateUpdateTag = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Tag name is required")
    .isLength({ max: 50 })
    .withMessage("Tag name must be at most 50 characters"),
  body("color")
    .optional()
    .isHexColor()
    .withMessage("Color must be a valid hex color code"),
];
