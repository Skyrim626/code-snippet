import Tag from "../models/Tag.js";

/**
 * Repository for managing tags in the database.
 */
class TagRepository {
  /**
   * Create a new tag
   * @param {Object} tagData - Tag data
   * @returns {Promise<Object>} Created tag
   */
  async createTag(tagData) {
    const tag = await Tag.create(tagData);
    return tag;
  }

  /**
   * Get all tags
   * @returns {Promise<Array>} List of tags
   */
  async getAllTags() {
    const tags = await Tag.find();
    return tags;
  }

  /**
   * Get a tag by ID
   * @param {String} tagId - Tag ID
   * @returns {Promise<Object>} Tag object
   */
  async getTagById(tagId) {
    const tag = await Tag.findById(tagId);

    return tag;
  }

  /**
   * Update a tag by ID
   * @param {String} tagId - Tag ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated tag
   */
  async updateTag(tagId, updateData) {
    const tag = await Tag.findByIdAndUpdate(tagId, updateData, {
      new: true,
    });

    return tag;
  }

  /**
   * Delete a tag by ID
   * @param {String} tagId - Tag ID
   * @returns {Promise<void>} Deleted tag
   */
  async deleteTag(tagId) {
    await Tag.findByIdAndDelete(tagId);
  }
}

export default new TagRepository();
