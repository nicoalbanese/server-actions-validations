"use client";
import { CompleteAuthor } from "@/lib/db/schema/authors";
import { trpc } from "@/lib/trpc/client";
import AuthorModal from "./AuthorModal";


export default function AuthorList({ authors }: { authors: CompleteAuthor[] }) {
  const { data: a } = trpc.authors.getAuthors.useQuery(undefined, {
    initialData: { authors },
    refetchOnMount: false,
  });

  if (a.authors.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {a.authors.map((author) => (
        <Author author={author} key={author.id} />
      ))}
    </ul>
  );
}

const Author = ({ author }: { author: CompleteAuthor }) => {
  return (
    <li className="flex justify-between my-2">
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

