import { db } from "@/lib/db/index";
import { 
  AuthorId, 
  NewAuthorParams,
  UpdateAuthorParams, 
  updateAuthorSchema,
  insertAuthorSchema, 
  authorIdSchema 
} from "@/lib/db/schema/authors";
import { getUserAuth } from "@/lib/auth/utils";

export const createAuthor = async (author: NewAuthorParams) => {
  const { session } = await getUserAuth();
  const newAuthor = insertAuthorSchema.parse({ ...author, userId: session?.user.id! });
  try {
    const a = await db.author.create({ data: newAuthor });
    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateAuthor = async (id: AuthorId, author: UpdateAuthorParams) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  const newAuthor = updateAuthorSchema.parse({ ...author, userId: session?.user.id! });
  try {
    const a = await db.author.update({ where: { id: authorId, userId: session?.user.id! }, data: newAuthor})
    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteAuthor = async (id: AuthorId) => {
  const { session } = await getUserAuth();
  const { id: authorId } = authorIdSchema.parse({ id });
  try {
    const a = await db.author.delete({ where: { id: authorId, userId: session?.user.id! }})
    return { author: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

