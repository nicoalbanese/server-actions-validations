"use client";

import { type Book, CompleteBook } from "@/lib/db/schema/books";
import BookModal from "./BookModalNew";
import { Author } from "@/lib/db/schema/authors";
import { cn } from "@/lib/utils";
import { useOptimisticBooks } from "@/app/books-hf-sa/useOptimisticBooks";
import { Button } from "../ui/button";
import { useState } from "react";
import BookForm from "./BookForm";

type TOpenModal = (book?: Book) => void;

export default function BookList({
  books,
  authors,
}: {
  books: CompleteBook[];
  authors: Author[];
}) {
  const { optimisticBooks, addOptimisticBook } = useOptimisticBooks(
    books,
    authors,
  );
  const [open, setOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const openModal = (book?: Book) => {
    setOpen(true);
    book ? setActiveBook(book) : setActiveBook(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <BookModal
        open={open}
        setOpen={setOpen}
        title={activeBook ? "Edit Book" : "Create Book"}
      >
        <BookForm
          book={activeBook}
          addOptimistic={addOptimisticBook}
          authors={authors}
          openModal={openModal}
          closeModal={closeModal}
        />
      </BookModal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBooks.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBooks.map((book) => (
            <Book book={book} key={book.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Book = ({
  book,
  openModal,
}: {
  book: Book | CompleteBook;
  openModal: TOpenModal;
}) => {
  const optimistic = book.id === "optimistic";
  const deleting = book.id === "delete";
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
        <div>{book.title}</div>
      </div>
      <Button
        onClick={() => openModal(book)}
        disabled={mutating}
        variant={"ghost"}
      >
        Edit
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No books
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new book.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>Create a new Book</Button>
      </div>
    </div>
  );
};
