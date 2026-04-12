/**
 * Feedback Entity
 * This class ensures that every feedback object in our system is valid,
 * regardless of where it comes from (API, Database, or CLI).
 */
class FeedbackEntity {
  constructor({ name, email, message }) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.createdAt = new Date();

    // Self-validation: The entity protects itself
    this.validate();
  }

  validate() {
    if (!this.name || this.name.length < 3) {
      throw new Error("Name must be at least 3 characters long.");
    }

    if (!this.email || !this.email.includes("@")) {
      throw new Error("A valid email is required.");
    }

    if (!this.message || this.message.length > 500) {
      throw new Error("Message is required and must be under 500 characters.");
    }
  }
}

module.exports = { FeedbackEntity };