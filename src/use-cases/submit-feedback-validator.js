const { z } = require("zod");

// Schema definition using Zod
// This ensures that the data follows our business rules before processing
const submitFeedbackSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" }),
});

module.exports = { submitFeedbackSchema };
