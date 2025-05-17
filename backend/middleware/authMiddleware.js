import jwt from "jsonwebtoken";
import asyncHandler from "./asyncMiddleware.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies
  console.log(req);

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check for token in cookies
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
