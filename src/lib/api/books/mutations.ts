import { db } from "@/lib/db/index";
import { 
  BookId, 
  NewBookParams,
  UpdateBookParams, 
  updateBookSchema,
  insertBookSchema, 
  bookIdSchema 
} from "@/lib/db/schema/books";
import { getUserAuth } from "@/lib/auth/utils";

export const createBook = async (book: NewBookParams) => {
  const { session } = await getUserAuth();
  const newBook = insertBookSchema.parse({ ...book, userId: session?.user.id! });
  try {
    const b = await db.book.create({ data: newBook });
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updateBook = async (id: BookId, book: UpdateBookParams) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  const newBook = updateBookSchema.parse({ ...book, userId: session?.user.id! });
  try {
    const b = await db.book.update({ where: { id: bookId, userId: session?.user.id! }, data: newBook})
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deleteBook = async (id: BookId) => {
  const { session } = await getUserAuth();
  const { id: bookId } = bookIdSchema.parse({ id });
  try {
    const b = await db.book.delete({ where: { id: bookId, userId: session?.user.id! }})
    return { book: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

