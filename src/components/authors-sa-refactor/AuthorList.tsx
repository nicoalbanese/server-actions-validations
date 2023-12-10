"use client";

import { CompleteAuthor } from "@/lib/db/schema/authors";
import AuthorModal from "./AuthorModal";
import { useOptimistic } from "react";
import { AddOptimisticFn, cn, optimisticUpdateFn } from "@/lib/utils";
import AuthorForm from "./AuthorForm";

export default function AuthorList({ authors }: { authors: CompleteAuthor[] }) {
  const [optimisticAuthors, addOptimisticAuthor] = useOptimistic(
    authors,
    optimisticUpdateFn<CompleteAuthor>,
  );

  const optimisticForm = { addOptimisticAuthor: addOptimisticAuthor };
  return (
    <>
      <div className="absolute right-0 top-0 ">
        <AuthorModal form={<AuthorForm {...optimisticForm} />} />
      </div>
      {optimisticAuthors.length === 0 ? (
        <EmptyState {...optimisticForm} />
      ) : (
        <ul>
          {optimisticAuthors.map((author) => (
            <Author author={author} key={author.id} {...optimisticForm} />
          ))}
        </ul>
      )}
    </>
  );
}

const Author = ({
  author,
  addOptimisticAuthor,
}: {
  author: CompleteAuthor;
  addOptimisticAuthor: AddOptimisticFn<CompleteAuthor>;
}) => {
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
      <AuthorModal
        author={author}
        disabled={mutating}
        form={
          <AuthorForm
            author={author}
            addOptimisticAuthor={addOptimisticAuthor}
          />
        }
      />
    </li>
  );
};

const EmptyState = ({
  addOptimisticAuthor,
}: {
  addOptimisticAuthor: AddOptimisticFn<CompleteAuthor>;
}) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No authors
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new author.
      </p>
      <div className="mt-6">
        <AuthorModal
          emptyState={true}
          form={<AuthorForm addOptimisticAuthor={addOptimisticAuthor} />}
        />
      </div>
    </div>
  );
};
