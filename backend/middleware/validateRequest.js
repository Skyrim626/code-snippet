import { validationResult } from "express-validator";
import ErrorResponse from "../utils/errorResponse.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    return next(new ErrorResponse(extractedErrors, 400));
  }
  next();
};

export default validateRequest;
