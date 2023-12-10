import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Book, NewBookParams } from "@/lib/db/schema/books";
import { TBookForm } from "@/app/books-hf-sa/useOptimisticBooks";

export default function BookModal({
  book,
  emptyState,
  form,
}: {
  book?: Book;
  emptyState?: boolean;
  form: TBookForm;
}) {
  const [b, setB] = useState<(Book | NewBookParams) | undefined>(book);
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const openModal = (book?: NewBookParams) => {
    setOpen(true);
    setB(b);
  };
  const editing = !!book?.id;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New Book
          </Button>
        ) : (
          <Button
            variant={editing ? "ghost" : "outline"}
            size={editing ? "sm" : "icon"}
          >
            {editing ? "Edit" : "+"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Book</DialogTitle>
        </DialogHeader>
        {/* @ts-expect-error */}
        <div className="px-5 pb-5">{form(closeModal, book, openModal)}</div>
      </DialogContent>
    </Dialog>
  );
}
