import jwt from "jsonwebtoken";
import asyncHandler from "./asyncMiddleware.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import BlacklistedToken from "../models/BlacklistedToken.js";

// @desc    Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return next(
        new ErrorResponse("Token has been revoked. Please login again.", 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
