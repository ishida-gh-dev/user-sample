import db from "../utils/db";

export default defineEventHandler(() => {
  const users = db.prepare("SELECT * FROM users").all();
  return users;
});
