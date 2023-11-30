import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { authorsRouter } from "./authors";

export const appRouter = router({
  computers: computersRouter,
  authors: authorsRouter,
});

export type AppRouter = typeof appRouter;
