import { updateUser, findUserById } from "../repositories/userRepository";

type UpdateUserResult =
  | { type: "not_found" }
  | { type: "no_change"; user: User }
  | { type: "updated"; before: User; after: User };

export const updateUserService = (
  id: number,
  name: string | undefined,
  age: number | undefined,
): UpdateUserResult => {
  const user = findUserById(id);

  if (!user) {
    return { type: "not_found" };
  }

  const nextName = name ?? user.name;
  const nextAge = age ?? user.age;

  if (user.name === nextName && user.age === nextAge) {
    // 変更なし
    return { type: "no_change", user };
  }
  updateUser(id, name, age);

  const updated = findUserById(id) as User;

  return {
    type: "updated",
    before: user,
    after: updated,
  };
};
