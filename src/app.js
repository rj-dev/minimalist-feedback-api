const fastify = require("fastify");
const { z } = require("zod");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");

const { SubmitFeedback } = require("./use-cases/submit-feedback");
const { FeedbackController } = require("./infra/http/feedback-controller");
const {
  SqliteFeedbackRepository,
} = require("./repositories/sqlite/sqlite-feedback-repository");

const app = fastify({ logger: true });

// Determine database path based on environment
const databasePath =
  process.env.NODE_ENV === "test" ? "./database.test.db" : "./database.db";

// 1. Dependency Injection Setup
// const repository = new InMemoryFeedbackRepository();
// const repository = new PrismaFeedbackRepository();
const repository = new SqliteFeedbackRepository(databasePath);
const submitFeedback = new SubmitFeedback(repository);
const controller = new FeedbackController(submitFeedback);

// Register Swagger
app.register(async function (instance) {
  // Swagger configuration
  await instance.register(swagger, {
    openapi: {
      info: { title: "Minimalist Feedback API", version: "1.0.0" },
    },
  });

  await instance.register(swaggerUi, {
    routePrefix: "/docs",
  });

  // 2. Route Definitions
  instance.post(
    "/feedbacks",
    {
      schema: {
        tags: ["Feedbacks"],
        body: {
          type: "object",
          required: ["name", "email", "message"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    (req, res) => controller.handle(req, res),
  );

  instance.get(
    "/feedbacks",
    {
      schema: { tags: ["Feedbacks"] },
    },
    (req, res) => controller.list(req, res),
  );
});

// Global error handler for Zod validation errors
app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    const validationErrors = error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
    return reply
      .status(400)
      .send({ message: "Validation failed.", errors: validationErrors });
  }
  return reply.status(500).send({ message: "Internal server error." });
});

module.exports = { app };
