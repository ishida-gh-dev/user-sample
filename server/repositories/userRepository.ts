import db from "../utils/db";

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

export const findUserById = (id: number): User | null => {
  const result = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | User
    | undefined;

  return result ?? null;
};
