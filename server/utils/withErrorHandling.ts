import type { H3Event } from "h3";
import { handleDomainError } from "./handleDomainError";

export function withErrorHandling<T>(fn: (event: H3Event) => Promise<T>) {
  return async (event: H3Event): Promise<T> => {
    try {
      return await fn(event);
    } catch (error) {
      handleDomainError(error);
    }
  };
}
