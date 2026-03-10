import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserService } from "../../..//services/userService";
import { none, some } from "../../../utils/Option";
import { UserRepository } from "~/server/repositories/userRepository";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";

vi.mock("../../../utils/db", () => ({
  default: {
    transaction: (fn: Function) => fn,
  },
}));

describe("updateUserService", () => {
  let testCounter = 0;
  let fakeRepo: UserRepository;
  let service: ReturnType<typeof createUserService>;
  beforeEach(() => {
    vi.clearAllMocks();
    testCounter++;
    console.log(`Starting Test #${testCounter}`);
    fakeRepo = {
      findUserById: vi.fn(),
      updateUser: vi.fn(),
      insertUserLog: vi.fn(),
    };
    service = createUserService(fakeRepo);
  });

  it("更新時は更新処理とログ保存が呼ばれる", () => {
    const before = Object.freeze({ id: 1, name: "Alice", age: 20 });
    const after = { id: 1, name: "Bob", age: 30 };

    vi.mocked(fakeRepo.findUserById).mockReturnValueOnce(some(before));

    service.updateUserService(1, "Bob", 30);
    expect(fakeRepo.updateUser).toHaveBeenCalledWith(1, "Bob", 30);
    expect(fakeRepo.insertUserLog).toHaveBeenCalledWith(1, before, after);
    expect(fakeRepo.findUserById).toHaveBeenCalledTimes(1);
  });

  it("更新がある場合は updated を返す", () => {
    const before = Object.freeze({ id: 1, name: "Alice", age: 20 });
    const after = { id: 1, name: "Bob", age: 30 };

    vi.mocked(fakeRepo.findUserById).mockReturnValueOnce(some(before));

    const result = service.updateUserService(1, "Bob", 30);

    expect(result.type).toBe("updated");
    if (result.type !== "updated") return;
    expect(result.before).toEqual(before);
    expect(result.after).toEqual(after);
  });

  it("変更がない場合は no_change を返す", () => {
    const user = { id: 1, name: "Alice", age: 20 };

    vi.mocked(fakeRepo.findUserById).mockReturnValueOnce(some(user));

    const result = service.updateUserService(1, "Alice", 20);

    expect(result.type).toBe("no_change");
    if (result.type !== "no_change") return;
    expect(result.user).toEqual(user);

    expect(fakeRepo.updateUser).not.toHaveBeenCalled();
    expect(fakeRepo.insertUserLog).not.toHaveBeenCalled();
  });

  it("ユーザが存在しない場合は例外", () => {
    vi.mocked(fakeRepo.findUserById).mockReturnValueOnce(none());

    expect(() => service.updateUserService(1, "Alice", 20)).toThrow(
      UserNotFoundError,
    );
  });
});
