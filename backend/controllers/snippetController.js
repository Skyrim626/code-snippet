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

  // Search by title or description if provided
  const { search } = req.query;
  if (search) {
    snippets = snippets.filter(
      (snippet) =>
        snippet.title.includes(search) || snippet.description.includes(search)
    );
  }

  // Filter by programming language if provided
  const { programmingLanguage } = req.query;
  if (programmingLanguage) {
    snippets = snippets.filter(
      (snippet) => snippet.programmingLanguage === programmingLanguage
    );
  }

  res.status(200).json({
    success: true,
    data: snippets,
  });
});

// @desc    Get a single snippet
// @route   GET /api/snippets/:id
// @access  Private
export const getSnippetById = asyncHandler(async (req, res, next) => {
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return next(new ErrorResponse("Snippet not found", 404));
  }

  // Ensure the snippet belongs to the user
  if (snippet.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to access this snippet", 403)
    );
  }

  res.status(200).json({
    success: true,
    data: snippet,
  });
});

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
// @access  Private
export const updateSnippet = asyncHandler(async (req, res, next) => {
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

  // Find the snippet
  let snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return next(new ErrorResponse("Snippet not found", 404));
  }

  // Ensure the snippet belongs to the user
  if (snippet.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to access this snippet", 403)
    );
  }

  // Update the snippet
  snippet.title = title;
  snippet.description = description;
  snippet.code = code;
  snippet.programmingLanguage = programmingLanguage;
  snippet.tags = tags || [];

  await snippet.save();

  res.status(200).json({
    success: true,
    data: snippet,
  });
});

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
// @access  Private
export const deleteSnippet = asyncHandler(async (req, res, next) => {
  // Find the snippet
  const snippet = await Snippet.findById(req.params.id);

  if (!snippet) {
    return next(new ErrorResponse("Snippet not found", 404));
  }

  // Ensure the snippet belongs to the user
  if (snippet.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse("Not authorized to access this snippet", 403)
    );
  }

  // Delete the snippet
  await snippet.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
