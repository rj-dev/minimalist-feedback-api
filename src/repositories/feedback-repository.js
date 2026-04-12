/**
 * Feedback Repository Interface
 * This is a "contract". Any database implementation must follow this structure.
 * This allows us to swap databases easily in the future.
 */
class FeedbackRepository {
  async create(feedback) {
    throw new Error("Method 'create' must be implemented.");
  }

  async listAll() {
    throw new Error("Method 'listAll' must be implemented.");
  }
}

module.exports = { FeedbackRepository };