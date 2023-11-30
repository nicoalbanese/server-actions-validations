import * as z from "zod"

export const authorSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
})
