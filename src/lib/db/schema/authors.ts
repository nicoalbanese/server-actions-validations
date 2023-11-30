import { authorSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { getAuthors } from "@/lib/api/authors/queries";

// Schema for authors - used to validate API requests
export const insertAuthorSchema = authorSchema.omit({ id: true });

export const insertAuthorParams = authorSchema
  .extend({ name: z.string().min(5) })
  .omit({
    id: true,
    userId: true,
  });

export const updateAuthorSchema = authorSchema;

export const updateAuthorParams = updateAuthorSchema.extend({}).omit({
  userId: true,
});

export const authorIdSchema = updateAuthorSchema.pick({ id: true });

// Types for authors - used to type API request params and within Components
export type Author = z.infer<typeof updateAuthorSchema>;
export type NewAuthor = z.infer<typeof insertAuthorSchema>;
export type NewAuthorParams = z.infer<typeof insertAuthorParams>;
export type UpdateAuthorParams = z.infer<typeof updateAuthorParams>;
export type AuthorId = z.infer<typeof authorIdSchema>["id"];

// this type infers the return from getAuthors() - meaning it will include any joins
export type CompleteAuthor = Awaited<
  ReturnType<typeof getAuthors>
>["authors"][number];
