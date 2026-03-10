export type UpdateUserResult =
  | { type: "no_change"; user: User }
  | { type: "updated"; before: User; after: User };

export function decideUserUpdate(
  user: User,
  name?: string,
  age?: number,
): UpdateUserResult {
  const nextName = name ?? user.name;
  const nextAge = age ?? user.age;

  if (user.name === nextName && user.age === nextAge) {
    // 変更なし
    return { type: "no_change", user };
  }

  return {
    type: "updated",
    before: user,
    after: {
      ...user,
      name: nextName,
      age: nextAge,
    },
  };
}
