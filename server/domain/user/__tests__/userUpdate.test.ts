import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserService } from "../../..//services/userService";

describe("decideUserUpdate", () => {
  let testCounter = 0;
  beforeEach(() => {
    vi.clearAllMocks();
    testCounter++;
    console.log(`Starting Test #${testCounter}`);
  });

  //   it("変更がなければ no_change を返す", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, "Alice", 20);

  //     expect(result.type).toBe("no_change");

  //     if (result.type === "no_change") {
  //       expect(result.user).toEqual(user);
  //     }
  //   });

  //   it("名前が変われば update を返す", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, "Bob", 20);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(user);
  //       expect(result.after.name).toBe("Bob");
  //       expect(result.after.age).toBe(20);
  //     }
  //   });

  //   it("年齢だけ変更", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, "Alice", 30);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(user);
  //       expect(result.after.name).toBe("Alice");
  //       expect(result.after.age).toBe(30);
  //     }
  //   });

  //   it("名前・年齢両方変更", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, "Bob", 30);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(user);
  //       expect(result.after.name).toBe("Bob");
  //       expect(result.after.age).toBe(30);
  //     }
  //   });

  //   it("nameがundefined(未指定)", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, undefined, 30);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(user);
  //       expect(result.after.name).toBe("Alice");
  //       expect(result.after.age).toBe(30);
  //     }
  //   });

  //   it("ageがundefined(未指定)", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, "Bob", undefined);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(user);
  //       expect(result.after.name).toBe("Bob");
  //       expect(result.after.age).toBe(20);
  //     }
  //   });

  //   it("両方undefined(完全に未指定)", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     const result = decideUserUpdate(user, undefined, undefined);

  //     expect(result.type).toBe("no_change");

  //     if (result.type === "no_change") {
  //       expect(result.user).toEqual(user);
  //     }
  //   });
  //   vi.mock("../../../repositories/userRepository");
  //   it("ユーザーが存在しない → エラー", () => {
  //     vi.mocked(repo.findUserById).mockReturnValue({ type: "none" });

  //     expect(() => createUserService(1, "Bob", 30)).toThrowError();
  //   });
  //   it("変更なし → no_change", () => {
  //     const user = { id: 1, name: "Alice", age: 20 };

  //     vi.mocked(repo.findUserById).mockReturnValue({ type: "some", value: user });

  //     const result = createUserService(1, "Alice", 20);

  //     expect(result.type).toBe("no_change");
  //   });
  //   it("変更あり → updated", () => {
  //     const before = { id: 1, name: "Alice", age: 20 };
  //     const after = { id: 1, name: "Bob", age: 30 };

  //     vi.mocked(repo.findUserById)
  //       .mockReturnValueOnce({ type: "some", value: before })
  //       .mockReturnValueOnce({ type: "some", value: after });

  //     const result = updateUserService(1, "Bob", 30);

  //     expect(result.type).toBe("updated");

  //     if (result.type === "updated") {
  //       expect(result.before).toEqual(before);
  //       expect(result.after).toEqual(after);
  //     }

  //     expect(repo.updateUser).toHaveBeenCalled();
  //     expect(repo.insertUserLog).toHaveBeenCalled();
  //   });

  vi.mock("../utils/db", () => ({
    default: {
      transaction: (fn: Function) => fn,
    },
  }));
  it("更新時にトランザクション内の処理が呼ばれる", () => {
    const fakeRepo = {
      findUserById: vi.fn(),
      updateUser: vi.fn(),
      insertUserLog: vi.fn(),
    };

    const service = createUserService(fakeRepo);
    console.log("+++ 1");
    const before = Object.freeze({ id: 1, name: "Alice", age: 20 });
    const after = { id: 1, name: "Bob", age: 30 };

    console.log("+++ 2");
    vi.mocked(fakeRepo.findUserById)
      .mockImplementationOnce(() => ({ type: "some", value: { ...before } }))
      .mockImplementationOnce(() => ({ type: "some", value: { ...after } }));

    console.log("+++ 3");
    const mockedFind = vi.mocked(fakeRepo.findUserById);
    console.log("+++ 4");
    const mockedUpdate = vi.mocked(fakeRepo.updateUser);
    console.log("+++ 5");
    const result = service.updateUserService(1, "Bob", 30);
    console.log("+++ 6");
    console.log("1st call", mockedFind.mock.results[0]);
    console.log("2nd call", mockedFind.mock.results[1]);
    console.log("+++ 7");
    console.log(mockedUpdate.mock.calls);
    console.log("mock calls", fakeRepo.findUserById.mock.calls);
    console.log("mock impl", fakeRepo.findUserById.getMockName?.());
    expect(fakeRepo.updateUser).toHaveBeenCalledWith(1, "Bob", 30);
    expect(fakeRepo.insertUserLog).toHaveBeenCalledWith(1, before, after);
    expect(fakeRepo.findUserById).toHaveBeenCalledTimes(1);

    console.log({ before, after, result });
    expect(result.type).toBe("updated");
  });
});
