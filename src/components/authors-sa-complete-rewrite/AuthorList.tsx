"use client";
import AuthorModal from "./AuthorModal";
import { CompleteAuthor } from "@/lib/db/schema/authors";
import { AddOptimisticFn, cn, optimisticUpdateFn } from "@/lib/utils";
import { createContext, useOptimistic } from "react";

export const AuthorContext = createContext<{
  addOptimisticAuthor: AddOptimisticFn<CompleteAuthor>;
  books: string[];
}>({ addOptimisticAuthor: () => {}, books: [] });

export default function AuthorList({ authors }: { authors: CompleteAuthor[] }) {
  const [optimisticAuthors, addOptimisticAuthor] = useOptimistic(
    authors,
    optimisticUpdateFn<CompleteAuthor>,
  );

  return (
    <AuthorContext.Provider
      value={{ addOptimisticAuthor, books: ["one", "two"] }}
    >
      <div className="absolute top-0 right-0">
        <AuthorModal />
      </div>
      {optimisticAuthors.length > 0 ? (
        <ul>
          {optimisticAuthors.map((author) => (
            <Author key={author.id} author={author} />
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </AuthorContext.Provider>
  );
}

const Author = ({ author }: { author: CompleteAuthor }) => {
  const optimistic = author.id === "optimistic";
  const deleting = author.id === "delete";
  const mutating = optimistic || deleting;
  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{author.name}</div>
      </div>
      <AuthorModal author={author} disabled={mutating} />
    </li>
  );
};

const EmptyState = ({}: {}) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No authors
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new author.
      </p>
      <div className="mt-6">
        <AuthorModal emptyState={true} />
      </div>
    </div>
  );
};
