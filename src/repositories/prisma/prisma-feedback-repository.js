const { PrismaClient } = require("@prisma/client");
const { FeedbackRepository } = require("../feedback-repository");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db",
    },
  },
});

class PrismaFeedbackRepository extends FeedbackRepository {
  async create(data) {
    const feedback = await prisma.feedback.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
    return feedback;
  }

  async listAll() {
    return await prisma.feedback.findMany();
  }
}

module.exports = { PrismaFeedbackRepository };
