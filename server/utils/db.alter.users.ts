import Database from "better-sqlite3";

const db = new Database("database.sqlite");

db.exec(`
    ALTER TABLE users ADD COLUMN age INTEGER;
`);

export default db;
