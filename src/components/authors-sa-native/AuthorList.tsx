"use client";

import { CompleteAuthor } from "@/lib/db/schema/authors";
import AuthorModal from "./AuthorModal";
import { useOptimistic, createContext } from "react";
import { AddOptimisticFn, cn, optimisticUpdateFn } from "@/lib/utils";

export const AuthorContext = createContext<{
  addOptimisticAuthor: AddOptimisticFn<CompleteAuthor>;
}>({ addOptimisticAuthor: () => {} });

export default function AuthorList({ authors }: { authors: CompleteAuthor[] }) {
  const [optimisticAuthors, addOptimisticAuthor] = useOptimistic(
    authors,
    optimisticUpdateFn<CompleteAuthor>,
  );

  if (optimisticAuthors.length === 0) {
    return (
      <AuthorContext.Provider value={{ addOptimisticAuthor }}>
        <EmptyState />
      </AuthorContext.Provider>
    );
  }

  return (
    <AuthorContext.Provider value={{ addOptimisticAuthor }}>
      <div className="absolute right-0 top-0 ">
        <AuthorModal />
      </div>
      <ul>
        {optimisticAuthors.map((author) => (
          <Author author={author} key={author.id} />
        ))}
      </ul>
    </AuthorContext.Provider>
  );
}

const Author = ({ author }: { author: CompleteAuthor }) => {
  const optimistic = author.id === "optimistic";
  return (
    <li
      className={cn(
        "flex justify-between my-2",
        optimistic ? "opacity-50 animate-pulse" : "",
      )}
    >
      <div className="w-full">
        <div>{author.name}</div>
      </div>
      <AuthorModal author={author} />
    </li>
  );
};

const EmptyState = () => {
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
