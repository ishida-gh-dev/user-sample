import db from "../utils/db";
import { decideUserUpdate, UpdateUserResult } from "../domain/user/userUpdate";
import { unwrap } from "../utils/Option";
import type { UserRepository } from "../repositories/userRepository";
import { UserNotFoundError } from "../errors/UserNotFoundError";

export const createUserService = (repo: UserRepository) => {
  const updateUserService = (
    id: number,
    name: string | undefined,
    age: number | undefined,
  ): UpdateUserResult => {
    const usrOpt = repo.findUserById(id);
    if (usrOpt.type === "none") {
      throw new UserNotFoundError();
    }
    const user = usrOpt.value;

    const decision = decideUserUpdate(user, name, age);

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
