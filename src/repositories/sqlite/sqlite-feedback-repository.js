const Database = require("better-sqlite3");
const { FeedbackRepository } = require("../feedback-repository");
const { randomUUID } = require("crypto");

// Connect to the database
const db = new Database("./database.db");

// Initialize the table
db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT,
    createdAt TEXT
  )
`);

class SqliteFeedbackRepository extends FeedbackRepository {
  /**
   * Persists a new feedback into the SQLite database
   */
  async create(data) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(
      "INSERT INTO feedbacks (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, ?)",
    );
    stmt.run(id, data.name, data.email, data.message, createdAt);

    return { id, ...data, createdAt };
  }

  /**
   * Retrieves all feedbacks from the database
   */
  async listAll() {
    const rows = db
      .prepare("SELECT * FROM feedbacks ORDER BY createdAt DESC")
      .all();
    return rows;
  }
}

module.exports = { SqliteFeedbackRepository };
