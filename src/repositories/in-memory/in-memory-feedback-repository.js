const { FeedbackRepository } = require('../feedback-repository');

class InMemoryFeedbackRepository extends FeedbackRepository {
  constructor() {
    super();
    this.feedbacks = [];
  }

  async create(feedback) {
    this.feedbacks.push(feedback);
    return feedback;
  }

  async listAll() {
    return this.feedbacks;
  }
}

module.exports = { InMemoryFeedbackRepository };