import * as z from "zod"
import { CompleteBook, relatedBookSchema } from "./index"

export const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  userId: z.string(),
})

export interface CompleteAuthor extends z.infer<typeof authorSchema> {
  books: CompleteBook[]
}

/**
 * relatedAuthorSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAuthorSchema: z.ZodSchema<CompleteAuthor> = z.lazy(() => authorSchema.extend({
  books: relatedBookSchema.array(),
}))
