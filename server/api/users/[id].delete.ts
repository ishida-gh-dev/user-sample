import db from "../../utils/db";
import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const idCheckResult = idSchema.safeParse({ id: event.context.params?.id });
  if (!idCheckResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDの入力が不正です",
      data: idCheckResult.error.flatten(),
    });
  }
  const id = idCheckResult.data.id;

  const result = db.prepare("DELETE FROM users WHERE id = ?").run(id);
  if (result.changes === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "User Not Found",
    });
  }
  setResponseStatus(event, 204);
  return null;
});
