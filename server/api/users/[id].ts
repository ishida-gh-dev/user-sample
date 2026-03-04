import db from "../../utils/db";

export default defineEventHandler((event) => {
  const id = Number(event.context.params?.id);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) {
    throw createError({
      status: 404,
      statusText: "User Not Found",
    });
  }

  return user;
});
