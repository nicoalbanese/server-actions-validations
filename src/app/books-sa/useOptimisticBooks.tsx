import { type Author } from "@/lib/db/schema/authors";
import { Book, CompleteBook } from "@/lib/db/schema/books";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Book>) => void;

export const useOptimisticBooks = (
  books: CompleteBook[],
  authors: Author[],
) => {
  const [optimisticBooks, addOptimisticBook] = useOptimistic(
    books,
    (
      currentState: CompleteBook[],
      action: OptimisticAction<Book>,
    ): CompleteBook[] => {
      const { data } = action;

      const optimisticAuthor = authors.find(
        (author) => author.id === data.authorId,
      )!;

      const optimisticBook = {
        ...data,
        author: optimisticAuthor,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBook]
            : [...currentState, optimisticBook];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBook } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticBook, optimisticBooks };
};
