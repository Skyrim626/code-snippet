import Tag from "../models/Tag.js";
import asyncHandler from "../middleware/asyncMiddleware.js";
import ErrorResponse from "../utils/errorResponse.js";
import tagRepository from "../repositories/tagRepository.js";

// @desc    Create a new tag
// @route   POST /api/tags
// @access  Private
export const createTag = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Check if the tag already exists
  const existingTag = await Tag.findOne({ name, user: req.user.id });
  if (existingTag) {
    return next(new ErrorResponse("Tag already exists", 400));
  }

  // Create the new tag
  const tag = await tagRepository.createTag(req.body);

  res.status(201).json({
    success: true,
    data: tag,
  });
});

// @desc    Get all tags
// @route   GET /api/tags
// @access  Private
export const getAllTags = asyncHandler(async (req, res, next) => {
  // Get all tags from the repository
  const tags = await tagRepository.getAllTags();

  // Response with tags
  res.status(200).json({
    success: true,
    data: tags,
  });
});

// @desc    Get a tag by ID
// @route   GET /api/tags/:id
// @access  Private
export const getTagById = asyncHandler(async (req, res, next) => {
  const tag = await tagRepository.getTagById(req.params.id);

  if (!tag) {
    return next(new ErrorResponse("Tag not found", 404));
  }

  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc    Update a tag by ID
// @route   PUT /api/tags/:id
// @access  Private
export const updateTag = asyncHandler(async (req, res, next) => {
  const tag = await tagRepository.updateTag(req.params.id, req.body);

  if (!tag) {
    return next(new ErrorResponse("Tag not found", 404));
  }

  res.status(200).json({
    success: true,
    data: tag,
  });
});

// @desc    Delete a tag by ID
// @route   DELETE /api/tags/:id
// @access  Private
export const deleteTag = asyncHandler(async (req, res, next) => {
  await tagRepository.deleteTag(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
