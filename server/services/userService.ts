import db from "../utils/db";
import { decideUserUpdate, UpdateUserResult } from "../domain/user/userUpdate";
import { unwrap } from "../utils/Option";
import type { UserRepository } from "../repositories/userRepository";

export const createUserService = (repo: UserRepository) => {
  const updateUserService = (
    id: number,
    name: string | undefined,
    age: number | undefined,
  ): UpdateUserResult => {
    console.log("*** 1", id, name, age);
    const user = unwrap(repo.findUserById(id));

    console.log("updateUserService decideUserUpdate param", user, name, age);

    const decision = decideUserUpdate(user, name, age);
    console.log("updateUserService decision", decision);

    if (decision.type === "no_change") {
      return decision;
    }
    const updatedUser = db.transaction(() => {
      repo.updateUser(id, decision.after.name, decision.after.age);
      repo.insertUserLog(id, decision.before, decision.after);
      return decision.after;
    })();

    return {
      type: "updated",
      before: decision.before,
      after: updatedUser,
    };
  };

  return { updateUserService };
};
