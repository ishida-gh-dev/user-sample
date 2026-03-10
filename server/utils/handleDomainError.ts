import { UserNotFoundError } from "~/server/errors/UserNotFoundError";

export function handleDomainError(error: unknown): never {
  if (error instanceof UserNotFoundError) {
    throw createError({
      statusCode: 404,
      statusMessage: "User Not Found",
    });
  }

  throw createError({ statusCode: 500 });
}
