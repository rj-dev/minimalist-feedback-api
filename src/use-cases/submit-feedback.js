const { submitFeedbackSchema } = require("./submit-feedback-validator");
const NodemailerProvider = require("../providers/mail-provider/nodemailer-provider");
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

    // 1. Save feedback to database
    const feedback = await this.feedbackRepository.create({
      name,
      email,
      message,
    });

    const mailProvider = new NodemailerProvider();

    // 2. Send email notification
    // We don't "await" here if we don't want to delay the API response,
    // but usually, it's safer to await or use a background job.
    try {
      await mailProvider.sendMail({
        to: "Your Name <admin@example.com>",
        subject: "New Feedback Received!",
        body: [
          `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
          `<p><strong>From:</strong> ${name} (${email})</p>`, // Use as variáveis certas aqui
          `<p><strong>Message:</strong> ${message}</p>`, // E aqui
          `</div>`,
        ].join("\n"),
      });
      console.log("✅ Email sent successfully!");
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }

    return feedback;
  }
}

module.exports = { SubmitFeedback };
