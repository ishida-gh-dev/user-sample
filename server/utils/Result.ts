import { U } from "vue-router/dist/router-CWoNjPRp.mjs";

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function map<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (!result.ok) {
    return result;
  }
  return ok(fn(result.value));
}

export function flatMap<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (!result.ok) {
    return result;
  }

  return fn(result.value);
}
