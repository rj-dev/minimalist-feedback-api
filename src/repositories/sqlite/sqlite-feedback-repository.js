const Database = require("better-sqlite3");
const { FeedbackRepository } = require("../feedback-repository");
const { randomUUID } = require("crypto");

class SqliteFeedbackRepository extends FeedbackRepository {
  /**
   * @param {string} databasePath - Path to the SQLite file
   */
  constructor(databasePath = "./database.db") {
    super();
    this.db = new Database(databasePath);
    this.init();
  }

  init() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        createdAt TEXT
      )
    `);
  }

  async create(data) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    const stmt = this.db.prepare(
      "INSERT INTO feedbacks (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, ?)",
    );
    stmt.run(id, data.name, data.email, data.message, createdAt);

    return { id, ...data, createdAt };
  }

  async listAll() {
    return this.db
      .prepare("SELECT * FROM feedbacks ORDER BY createdAt DESC")
      .all();
  }

  // Close the database connection when done
  close() {
    this.db.close();
  }
}

module.exports = { SqliteFeedbackRepository };
