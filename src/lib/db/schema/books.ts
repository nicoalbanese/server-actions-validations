import { bookSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getBooks } from "@/lib/api/books/queries";

// Schema for books - used to validate API requests
export const insertBookSchema = bookSchema.omit({ id: true });

export const insertBookParams = bookSchema
  .extend({
    authorId: z.coerce.string().min(1),
    title: z.string().min(3),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateBookSchema = bookSchema;

export const updateBookParams = updateBookSchema
  .extend({
    authorId: z.coerce.string(),
  })
  .omit({
    userId: true,
  });

export const bookIdSchema = updateBookSchema.pick({ id: true });

// Types for books - used to type API request params and within Components
export type Book = z.infer<typeof updateBookSchema>;
export type NewBook = z.infer<typeof insertBookSchema>;
export type NewBookParams = z.infer<typeof insertBookParams>;
export type UpdateBookParams = z.infer<typeof updateBookParams>;
export type BookId = z.infer<typeof bookIdSchema>["id"];

// this type infers the return from getBooks() - meaning it will include any joins
export type CompleteBook = Awaited<
  ReturnType<typeof getBooks>
>["books"][number];
