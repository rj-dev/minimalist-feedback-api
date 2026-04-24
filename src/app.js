require("dotenv").config();
const fastify = require("fastify");
const { z } = require("zod");
const swagger = require("@fastify/swagger");
const swaggerUi = require("@fastify/swagger-ui");
const jwt = require("@fastify/jwt");

// Imports
const { SubmitFeedback } = require("./use-cases/submit-feedback");
const { FeedbackController } = require("./infra/http/feedback-controller");
const {
  SqliteFeedbackRepository,
} = require("./repositories/sqlite/sqlite-feedback-repository");
const { feedbackRoutes } = require("./infra/http/routes/feedback-routes");
const { env } = require("./env");

const app = fastify({ logger: true });

// 1. Dependency Injection setup
const databasePath =
  env.NODE_ENV === "test" ? "./database.test.db" : env.DATABASE_URL;
const repository = new SqliteFeedbackRepository(databasePath);
const submitFeedback = new SubmitFeedback(repository);
const controller = new FeedbackController(submitFeedback);

// 2. Global Plugins & Routes Registration
app.register(async function (instance) {
  // Swagger Setup
  await instance.register(swagger, {
    openapi: {
      info: {
        title: "Minimalist Feedback API",
        version: "1.0.0",
        description: "API with JWT Authentication",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await instance.register(swaggerUi, { routePrefix: "/docs" });

  // Registering our new routes file and passing the controller
  instance.register(feedbackRoutes, { controller });
});

// JWT Authentication Setup
app.register(jwt, {
  secret: env.JWT_SECRET,
});

// Authentication Middleware
app.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// 3. Global Error Handler
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
