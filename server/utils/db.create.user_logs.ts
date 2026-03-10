import Database from "better-sqlite3";

const db = new Database("database.sqlite");

db.exec(`
    CREATE TABLE user_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        old_name TEXT,
        old_age INTEGER,
        new_name TEXT,
        new_age INTEGER,
        updated_at TEXT
    );
`);

export default db;
