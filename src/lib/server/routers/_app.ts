import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { authorsRouter } from "./authors";
import { booksRouter } from "./books";

export const appRouter = router({
  computers: computersRouter,
  authors: authorsRouter,
  books: booksRouter,
});

export type AppRouter = typeof appRouter;
