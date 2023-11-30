import { getAuthorById, getAuthors } from "@/lib/api/authors/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  authorIdSchema,
  insertAuthorParams,
  updateAuthorParams,
} from "@/lib/db/schema/authors";
import { createAuthor, deleteAuthor, updateAuthor } from "@/lib/api/authors/mutations";

export const authorsRouter = router({
  getAuthors: publicProcedure.query(async () => {
    return getAuthors();
  }),
  getAuthorById: publicProcedure.input(authorIdSchema).query(async ({ input }) => {
    return getAuthorById(input.id);
  }),
  createAuthor: publicProcedure
    .input(insertAuthorParams)
    .mutation(async ({ input }) => {
      return createAuthor(input);
    }),
  updateAuthor: publicProcedure
    .input(updateAuthorParams)
    .mutation(async ({ input }) => {
      return updateAuthor(input.id, input);
    }),
  deleteAuthor: publicProcedure
    .input(authorIdSchema)
    .mutation(async ({ input }) => {
      return deleteAuthor(input.id);
    }),
});
