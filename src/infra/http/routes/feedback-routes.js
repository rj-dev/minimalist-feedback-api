const { z } = require("zod");

// We receive the controller via dependency injection
async function feedbackRoutes(instance, options) {
  const { controller } = options;

  instance.post(
    "/feedbacks",
    {
      schema: {
        tags: ["Feedbacks"],
        summary: "Submit a new feedback",
        body: {
          type: "object",
          required: ["name", "email", "message"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            message: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              message: { type: "string" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
    (req, res) => controller.handle(req, res),
  );

  instance.get(
    "/feedbacks",
    {
      onRequest: [instance.authenticate], // sucurity barrier for this route
      schema: {
        tags: ["Feedbacks"],
        summary: "List all feedbacks (Admin only)",
        security: [{ bearerAuth: [] }], // tells swagger that this route requires authentication
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                email: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
    (req, res) => controller.list(req, res),
  );

  instance.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate user and get a JWT token",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Success",
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          401: {
            description: "Invalid credentials",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      if (email === "admin@admin.com" && password === "123456") {
        const token = instance.jwt.sign(
          { email, role: "admin" },
          { expiresIn: "7d" },
        );
        return reply.send({ token });
      }

      return reply.status(401).send({ message: "Invalid credentials" });
    },
  );
}

module.exports = { feedbackRoutes };
