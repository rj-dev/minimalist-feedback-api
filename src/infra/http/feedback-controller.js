const { z } = require("zod");

/**
 * FeedbackController
 * Handles the HTTP communication layer.
 */
class FeedbackController {
  constructor(submitFeedback) {
    this.submitFeedback = submitFeedback;
  }

  async handle(request, reply) {
    // 1. Schema Validation (Input)
    const feedbackSchema = z.object({
      name: z.string().min(3),
      email: z.email(),
      message: z.string().max(500),
    });

    const data = feedbackSchema.parse(request.body);

    // 2. Call the Use Case
    const result = await this.submitFeedback.execute(data);

    return reply.status(201).send(result);
  }

  async list(request, reply) {
    const feedbacks = await this.submitFeedback.feedbackRepository.listAll();
    return reply.send(feedbacks);
  }
}

module.exports = { FeedbackController };
