import type { ApiResponse } from "~/types/api";
import { z } from "zod";
import { updateUserService } from "~/server/services/userService";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const userSchema = z.object({
  name: z.string("名前は必須です").min(1, "名前は必須です"),
  age: z.coerce.number("数値を入力してください").min(0, "年齢は0以上"),
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

  const body = await readBody(event);
  const checkResult = userSchema.safeParse(body);

  if (!checkResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "変更項目の入力が不正です",
      data: checkResult.error.flatten(),
    });
  }

  const { name, age } = checkResult.data;

  const result = updateUserService(id, name, age);

  if (result.type === "not_found") {
    throw createError({
      statusCode: 404,
      statusMessage: "User Not Found",
    });
  } else if (result.type === "no_change") {
    return {
      data: result.user,
      error: null,
    } satisfies ApiResponse<User>;
  }

  return {
    data: result.after,
    error: null,
  } satisfies ApiResponse<User>;
});
