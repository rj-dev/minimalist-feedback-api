const fastify = require("fastify");
const { SubmitFeedback } = require("./use-cases/submit-feedback");
const { FeedbackController } = require("./infra/http/feedback-controller");
//const { PrismaFeedbackRepository,} = require("./repositories/prisma/prisma-feedback-repository");
//const { InMemoryFeedbackRepository } = require('./repositories/in-memory/in-memory-feedback-repository');
const {
  SqliteFeedbackRepository,
} = require("./repositories/sqlite/sqlite-feedback-repository");
const { z } = require("zod"); // Import Zod to check instance types

// Determine database path based on environment
const databasePath =
  process.env.NODE_ENV === "test" ? "./database.test.db" : "./database.db";

const app = fastify({ logger: true });

// 1. Dependency Injection Setup
// const repository = new InMemoryFeedbackRepository();
// const repository = new PrismaFeedbackRepository();
const repository = new SqliteFeedbackRepository(databasePath);
const submitFeedback = new SubmitFeedback(repository);
const controller = new FeedbackController(submitFeedback);

// 2. Routes

// Route to submit feedback
app.post("/feedbacks", async (request, reply) => {
  return controller.handle(request, reply);
});

// Route to list all feedbacks
app.get("/feedbacks", async (request, reply) => {
  return controller.list(request, reply);
});

// 3. Start Server
/*
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("🚀 Server running at http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};*/

// --- Global Error Handler ---
app.setErrorHandler((error, request, reply) => {
  // Catching Zod validation errors
  if (error instanceof z.ZodError) {
    // We map the issues to create a clean, custom error object
    const validationErrors = error.issues.reduce((acc, issue) => {
      const path = issue.path[0];
      acc[path] = issue.message;
      return acc;
    }, {});

    return reply.status(400).send({
      message: "Validation failed.",
      errors: validationErrors,
    });
  }

  // Fallback for generic errors
  app.log.error(error);
  return reply.status(500).send({ message: "Internal server error." });
});

module.exports = { app };
