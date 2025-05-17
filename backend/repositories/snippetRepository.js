import Snippet from "../models/Snippet.js";

/**
 * Repository for managing snippets in the database.
 */
class SnippetRepository {
  /**
   * Get all snippets for a user with filtering and pagination
   * @param {Object} filters - Filters like search, language, tag
   * @param {Object} pagination - Pagination parameters
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Snippets and pagination info
   */
  async getAllSnippets(filters, pagination, userId) {
    const { search, programmingLanguage, tag } = filters;
    const { page, limit } = pagination;

    // Build the query
    let query = Snippet.find({ user: userId });

    // Apply search filter
    if (search) {
      query = query.or([
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ]);
    }

    // Apply programming language filter
    if (programmingLanguage) {
      query = query.where("programmingLanguage").equals(programmingLanguage);
    }

    // Apply tag filter
    if (tag) {
      query = query.where("tags").in([tag]);
    }

    // Pagination
    const totalSnippets = await Snippet.countDocuments(query);
    const totalPages = Math.ceil(totalSnippets / limit);
    const snippets = await query.skip((page - 1) * limit).limit(limit);

    return {
      snippets,
      totalPages,
      currentPage: page,
      totalSnippets,
    };
  }

  /**
   * Create a new snippet
   * @param {Object} snippetData - Snippet data
   * @returns {Promise<Object>} Created snippet
   */
  async createSnippet(snippetData) {
    const snippet = await Snippet.create(snippetData);

    // Update tag counts if tags are provided
    if (snippetData.tags && snippetData.tags.length > 0) {
      await this.updateTagsCount(snippetData.tags, snippetData.user);
    }

    return snippet;
  }

  /**
   * Update the snippet count for tags
   * @param {Array} tags - Array of tag IDs
   * @param {String} userId - User ID
   * @returns {Promise<void>}
   */
  async updateTagsCount(tags, userId) {
    const tagUpdatePromises = tags.map((tag) =>
      Snippet.updateOne(
        { _id: tag, user: userId },
        { $inc: { snippetCount: 1 } }
      )
    );

    await Promise.all(tagUpdatePromises);
  }

  /**
   * Get a snippet by ID
   * @param {String} snippetId - Snippet ID
   * @return {Promise<Object>} Snippet
   */
  async getSnippetById(snippetId) {
    const snippet = await Snippet.findById(snippetId);

    return snippet;
  }

  /**
   * Update a snippet by ID
   * @param {String} snippetId - Snippet ID
   * @param {Object} updateData - Data to update
   * @param {String} userId - User ID
   * @return {Promise<Object>} Updated snippet
   */
  async updateSnippet(snippetId, updateData, userId) {
    // Get the original snippet to handle tag updates
    const originalSnippet = await Snippet.findById(snippetId);

    if (!originalSnippet) {
      return null;
    }

    // Handle tag updates
    if (updateData.tags) {
      // Get old tags to decrease their count
      const oldTags = originalSnippet.tags || [];

      // First, decrease count for old tags that are no longer in the list
      const tagsToDecrease = oldTags.filter(
        (tag) => !updateData.tags.includes(tag)
      );

      if (tagsToDecrease.length > 0) {
        await this.updateTagsCount(tagsToDecrease, userId, -1);
      }

      // Then, increase count for new tags
      const tagsToIncrease = updateData.tags.filter(
        (tag) => !oldTags.includes(tag)
      );

      if (tagsToIncrease.length > 0) {
        await this.updateTagsCount(tagsToIncrease, userId);
      }
    }

    // Update the snippet
    return await Snippet.findByIdAndUpdate(snippetId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete a snippet by ID
   * @param {String} snippetId - Snippet ID
   * @return {Promise<void>}
   */
  async deleteSnippet(snippetId) {
    const snippet = await Snippet.findByIdAndDelete(snippetId);
    if (!snippet) {
      throw new Error("Snippet not found");
    }
    // Decrement the snippet count for tags
    if (snippet.tags && snippet.tags.length > 0) {
      await this.decrementTagsCount(snippet.tags, snippet.user);
    }
  }

  /**
   * Decrement the snippet count for tags
   * @param {Array} tags - Array of tag IDs
   * @param {String} userId - User ID
   * @return {Promise<void>}
   * This method is called when a snippet is deleted.
   */
  async decrementTagsCount(tags, userId) {
    const tagUpdatePromises = tags.map((tag) =>
      Snippet.updateOne(
        { _id: tag, user: userId },
        { $inc: { snippetCount: -1 } }
      )
    );

    await Promise.all(tagUpdatePromises);
  }

  /**
   * Get public snippets for a user
   * @param {String} userId - User ID
   * @return {Promise<Array>} Public snippets
   * This method is called when a user views their public profile.
   */
  async getPublicSnippets(userId) {
    const snippets = await Snippet.find({
      user: userId,
      isPublic: true,
    }).populate("tags");

    return snippets;
  }
}

export default new SnippetRepository();
