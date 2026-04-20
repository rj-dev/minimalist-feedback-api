const { submitFeedbackSchema } = require("./submit-feedback-validator");
/**
 * SubmitFeedback Use Case
 * Orchestrates the creation of a feedback.
 * It doesn't care IF it's an API or a CLI calling it.
 */
class SubmitFeedback {
  // We use Dependency Injection here (the repository is passed from outside)
  constructor(feedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async execute(request) {
    // Validate the input data against the schema
    // If validation fails, Zod will throw an error automatically
    const parsedData = submitFeedbackSchema.parse(request);

    const { name, email, message } = parsedData;

    // 1. Create the entity (this automatically triggers validation)
    /*
    const feedback = new (require("../domain/feedback-entity").FeedbackEntity)({
      name,
      email,
      message,
    });
    */

    // 2. Persist the data via repository contract
    // return await this.feedbackRepository.create(feedback);

    // Persist the validated data
    return await this.feedbackRepository.create({
      name,
      email,
      message,
    });
  }
}

module.exports = { SubmitFeedback };
