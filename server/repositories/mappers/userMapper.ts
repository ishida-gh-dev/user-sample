import { UserRow } from "../types/UserRow";

export function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
  };
}
