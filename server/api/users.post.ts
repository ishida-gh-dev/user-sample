import db from "../utils/db";
import type { ApiResponse } from "~/types/api";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  age: z.coerce.number("数値を入力してください").min(0, "年齢は0以上"),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const checkResult = userSchema.safeParse(body);

  if (!checkResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "入力が不正です",
      data: checkResult.error.flatten(),
    });
  }
  const { name, age } = checkResult.data;

  const result = db
    .prepare("INSERT INTO USERS (name, age) VALUES (?, ?)")
    .run(name, age);

  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const newUser = stmt.get(result.lastInsertRowid) as User;

  if (!newUser) {
    return {
      data: null,
      error: "作成に失敗しました",
    } satisfies ApiResponse<null>;
  }

  return {
    data: newUser,
    error: null,
  } satisfies ApiResponse<User>;
});
