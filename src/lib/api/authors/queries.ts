import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type AuthorId, authorIdSchema } from "@/lib/db/schema/authors";

export const getAuthors = async () => {
  const { session } = await getUserAuth();
  const a = await db.author.findMany({ where: {userId: session?.user.id!}});
  return { authors: a };
};

export const getAuthorById = async (id: AuthorId) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  const a = await db.author.findFirst({
    where: { id: authorId, userId: session?.user.id!}});
  return { authors: a };
};

