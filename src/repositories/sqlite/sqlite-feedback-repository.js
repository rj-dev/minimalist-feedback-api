const sqlite3 = require("sqlite3").verbose();
const { FeedbackRepository } = require("../feedback-repository");
const { randomUUID } = require("crypto");

// Connect to the database file (creates it if it doesn't exist)
const db = new sqlite3.Database("./database.db");

// Initialize the table structure
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      message TEXT,
      createdAt TEXT
    )
  `);
});

class SqliteFeedbackRepository extends FeedbackRepository {
  /**
   * Persists a new feedback into the SQLite database
   * @param {Object} data - The feedback entity data
   */
  async create(data) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(
        "INSERT INTO feedbacks (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, ?)",
      );

      stmt.run(id, data.name, data.email, data.message, createdAt, (err) => {
        if (err) return reject(err);
        resolve({ id, ...data, createdAt });
      });

      stmt.finalize();
    });
  }

  /**
   * Retrieves all feedbacks from the database
   */
  async listAll() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM feedbacks ORDER BY createdAt DESC",
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        },
      );
    });
  }
}

module.exports = { SqliteFeedbackRepository };
