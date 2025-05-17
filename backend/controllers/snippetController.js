import Snippet from "../models/Snippet.js";
import Tag from "../models/Tag.js";
import asyncHandler from "../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
export const createSnippet = asyncHandler(async (req, res, next) => {
  const { title, description, code, programmingLanguage, tags } = req.body;

  // Validate required fields
  if (!title || !code || !programmingLanguage) {
    return next(
      new ErrorResponse(
        "Title, code, and programming language are required",
        400
      )
    );
  }

  // Ensure we have a user from auth middleware
  if (!req.user || !req.user.id) {
    return next(new ErrorResponse("User authentication required", 401));
  }

  // Create a new snippet with the current user
  const snippet = await Snippet.create({
    title,
    description,
    code,
    programmingLanguage,
    user: req.user.id, // This automatically attaches the current user's ID
    tags: tags || [],
  });

  // Process tags if provided
  /* if (tags && tags.length > 0) {
    // Create tags that don't exist and update snippet count
    const tagPromises = tags.map(async (tagName) => {
      // Find or create the tag
      let tag = await Tag.findOne({
        name: tagName,
        user: req.user.id,
      });

      if (!tag) {
        // If tag doesn't exist, create it
        tag = await Tag.create({
          name: tagName,
          user: req.user.id,
          snippetCount: 1,
        });
      } else {
        // If tag exists, increment the snippet count
        tag.snippetCount += 1;
        await tag.save();
      }

      return tag;
    });

    await Promise.all(tagPromises);
  } */

  res.status(201).json({
    success: true,
    data: snippet,
  });
});

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Private
export const getAllSnippets = asyncHandler(async (req, res, next) => {
  const snippets = await Snippet.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    data: snippets,
  });
});
