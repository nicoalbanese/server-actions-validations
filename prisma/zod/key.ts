import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const keySchema = z.object({
  id: z.string(),
  hashed_password: z.string().nullish(),
  user_id: z.string(),
})

export interface CompleteKey extends z.infer<typeof keySchema> {
  user: CompleteUser
}

/**
 * relatedKeySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedKeySchema: z.ZodSchema<CompleteKey> = z.lazy(() => keySchema.extend({
  user: relatedUserSchema,
}))
