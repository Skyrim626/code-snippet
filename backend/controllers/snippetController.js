import Snippet from "../models/Snippet.js";
import Tag from "../models/Tag.js";
import asyncHandler from "../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/errorResponse.js";
import snippetRepository from "../repositories/snippetRepository.js";

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
export const createSnippet = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Create a new snippet with the current user
  const snippet = await snippetRepository.createSnippet(req.body);

  res.status(201).json({
    success: true,
    data: snippet,
  });
});

// @desc    Get all snippets
// @route   GET /api/snippets
// @access  Private
export const getAllSnippets = asyncHandler(async (req, res, next) => {
  // Ready the filters
  const filters = {
    search: req.query.search,
    language: req.query.language,
    tag: req.query.tag,
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection || "desc",
  };

  // Ready the pagination
  const pagination = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };

  // Get snippets from the repository
  const result = await snippetRepository.getAllSnippets(
    filters,
    pagination,
    req.user.id
  );

  // Response with snippets and pagination info
  res.status(200).json({
    success: true,
    data: {
      count: result.totalSnippets,
      currentPage: result.currentPage,
      data: result.snippets,
      pagination: {
        page: result.currentPage,
        limit: pagination.limit,
        totalPages: result.totalPages,
      },
    },
  });
});

// @desc    Get a single snippet
// @route   GET /api/snippets/:id
// @access  Private
export const getSnippetById = asyncHandler(async (req, res, next) => {
  const snippet = await snippetRepository.getSnippetById(req.params.id);

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
  // First check if snippet exists and user owns it
  const existingSnippet = await snippetRepository.getSnippetById(req.params.id);
  // Check if snippet exists
  if (!existingSnippet) {
    return next(
      new ErrorResponse(`Snippet not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user owns the snippet
  if (existingSnippet.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to update this snippet`, 401)
    );
  }

  // Update the snippet
  const snippet = await snippetRepository.updateSnippet(
    req.params.id,
    req.body,
    req.user.id
  );

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
  const snippet = await snippetRepository.getSnippetById(req.params.id);

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
  await snippetRepository.deleteSnippet(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
