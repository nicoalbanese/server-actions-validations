import * as z from "zod"
import { CompleteAuthor, relatedAuthorSchema } from "./index"

export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  authorId: z.string(),
  userId: z.string(),
})

export interface CompleteBook extends z.infer<typeof bookSchema> {
  author: CompleteAuthor
}

/**
 * relatedBookSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBookSchema: z.ZodSchema<CompleteBook> = z.lazy(() => bookSchema.extend({
  author: relatedAuthorSchema,
}))
