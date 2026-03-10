import { err, ok, Result } from "./Result";

export type Option<T> = { type: "some"; value: T } | { type: "none" };
export const some = <T>(value: T): Option<T> => ({
  type: "some",
  value,
});
export const none = <T>(): Option<T> => ({
  type: "none",
});
export function optionToResult<T, E>(
  opt: Option<T>,
  error: () => E,
): Result<T, E> {
  if (opt.type === "none") {
    return err(error());
  }
  return ok(opt.value);
}
export function unwrap<T>(opt: Option<T>): T {
  if (opt.type === "none") {
    throw new Error("Tried to unwrap none");
  }
  return opt.value;
}
