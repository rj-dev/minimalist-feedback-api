import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";
import { afterAll } from "vitest";
import fs from "fs";

describe("Submit Feedback E2E", () => {
  afterAll(async () => {
    // Close the database connection after all tests are done
    await app.close();

    try {
      // Delete the test database file if it exists
      if (fs.existsSync("./database.test.db")) {
        // Attempt to delete the test database file
        fs.unlinkSync("./database.test.db");
      }
    } catch (err) {
      console.warn(
        "Could not delete test database, it might still be locked. Error:",
        err.message,
      );
    }
  });

  it("should be able to submit a valid feedback", async () => {
    // Wait for fastify to be ready
    await app.ready();

    const response = await request(app.server).post("/feedbacks").send({
      name: "John Doe",
      email: "john@example.com",
      message: "This is a valid feedback message from integration test.",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to submit feedback with invalid email", async () => {
    await app.ready();

    const response = await request(app.server).post("/feedbacks").send({
      name: "John Doe",
      email: "invalid-email",
      message: "Valid message length",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed.");
  });
});
