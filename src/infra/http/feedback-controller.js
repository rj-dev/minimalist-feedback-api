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
      email: z.string().email(),
      message: z.string().max(500),
    });

    try {
      const data = feedbackSchema.parse(request.body);

      // 2. Call the Use Case
      const result = await this.submitFeedback.execute(data);

      return reply.status(201).send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ message: "Validation error", errors: error.errors });
      }
      return reply.status(500).send({ message: error.message });
    }
  }

  async list(request, reply) {
    const feedbacks = await this.submitFeedback.feedbackRepository.listAll();
    return reply.send(feedbacks);
  }
}

module.exports = { FeedbackController };
