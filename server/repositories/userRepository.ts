import db from "../utils/db";
import { none, Option, some } from "../utils/Option";
import { toUser } from "./mappers/userMapper";
import { UserRow } from "./types/UserRow";

export type UserRepository = {
  findUserById: (id: number) => Option<User>;
  updateUser: (
    id: number,
    name: string | undefined,
    age: number | undefined,
  ) => number;
  insertUserLog: (id: number, before: User, after: User) => void;
};

export const updateUser = (
  id: number,
  name: string | undefined,
  age: number | undefined,
) => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }
  if (age !== undefined) {
    fields.push("age = ?");
    values.push(age);
  }

  const updateSql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  // 配列を展開
  const result = db.prepare(updateSql).run(...values);

  return result.changes;
};

export function findUserById(id: number): Option<UserRow> {
  const stmt = db.prepare<[number], UserRow>(
    "SELECT id, name, age FROM users WHERE id = ?",
  );
  const row = stmt.get(id);

  if (!row) {
    return none();
  }

  return some(toUser(row));
}

export const insertUserLog = (userId: number, oldUser: User, newUser: User) => {
  db.prepare(
    "INSERT INTO user_logs (user_id, old_name, old_age, new_name, new_age, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(
    userId,
    oldUser.name,
    oldUser.age,
    newUser.name,
    newUser.age,
    new Date().toISOString(),
  );
  // throw createError("エラー発生");
};
