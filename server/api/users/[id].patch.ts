import type { ApiResponse } from "~/types/api";
import { z } from "zod";
import { updateUserService } from "~/server/services/userService";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const userSchema = z
  .object({
    name: z.string().min(1, "名前は必須です").optional(),
    age: z.coerce
      .number("数値を入力してください")
      .min(0, "年齢は0以上")
      .optional(),
  })
  .superRefine(({ name, age }, ctx) => {
    if (name === undefined && age === undefined) {
      ctx.addIssue({
        path: ["name", "age"],
        code: z.ZodIssueCode.custom,
        message: "更新項目を1つ以上指定してください",
      });
    }
  });

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const idCheckResult = idSchema.safeParse({ id: id });
  if (!idCheckResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDの入力が不正です",
      data: idCheckResult.error.flatten(),
    });
  }
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

  const result = updateUserService(idCheckResult.data.id, name, age);

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
