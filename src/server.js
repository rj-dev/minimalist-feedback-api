const fastify = require("fastify")({ logger: true });
//const { InMemoryFeedbackRepository } = require('./repositories/in-memory/in-memory-feedback-repository');
const { SubmitFeedback } = require("./use-cases/submit-feedback");
const { FeedbackController } = require("./infra/http/feedback-controller");
//const { PrismaFeedbackRepository,} = require("./repositories/prisma/prisma-feedback-repository");
const {
  SqliteFeedbackRepository,
} = require("./repositories/sqlite/sqlite-feedback-repository");

// 1. Dependency Injection Setup
// const repository = new InMemoryFeedbackRepository();
// const repository = new PrismaFeedbackRepository();
const repository = new SqliteFeedbackRepository();
const submitFeedback = new SubmitFeedback(repository);
const controller = new FeedbackController(submitFeedback);

// 2. Routes

// Route to submit feedback
fastify.post("/feedbacks", async (request, reply) => {
  return controller.handle(request, reply);
});

// Route to list all feedbacks
fastify.get("/feedbacks", async (request, reply) => {
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

const start = async () => {
  try {
    // Render uses the PORT environment variable
    const port = process.env.PORT || 3000;
    // For cloud environments, we need to listen on 0.0.0.0
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running at port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
