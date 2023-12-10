import { Book, insertBookParams } from "@/lib/db/schema/books";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  createBookAction,
  deleteBookAction,
  updateBookAction,
} from "@/lib/actions/books";
import { useEffect, useState, useTransition } from "react";
import { Author } from "@/lib/db/schema/authors";
import { TAddOptimistic } from "@/app/books-sa/useOptimisticBooks";
import { Action, cn } from "@/lib/utils";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";

const BookForm = ({
  authors,
  book,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  authors: Author[];
  book?: Book | null;
  openModal?: (book?: Book) => void;
  closeModal?: () => void;
  addOptimistic: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Book>(insertBookParams);
  const { toast } = useToast();
  const editing = !!book?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Book },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
    } else {
      router.refresh();
      postSuccess && postSuccess();
    }

    toast({
      title: failed ? "Failed" : "Success",
      description: failed ? `Failed to ${action}` : `Book ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const bookParsed = await insertBookParams.safeParseAsync(payload);
    if (!bookParsed.success) {
      setErrors(bookParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = bookParsed.data;
    try {
      startMutation(async () => {
        addOptimistic({
          data: {
            ...values,
            userId: "",
            authorId: "",
            id: editing ? book.id : "",
          },
          action: editing ? "update" : "create",
        });

        const data = editing
          ? await updateBookAction({ ...values, id: book.id })
          : await createBookAction(values);

        const error = {
          error: data?.error ?? "Error",
          values: editing
            ? { ...book, ...values }
            : { ...values, id: "", userId: "" },
        };
        onSuccess(editing ? "update" : "create", data ? error : undefined);
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.title ? "text-destructive" : "",
          )}
        >
          Title
        </Label>
        <Input
          type="text"
          name="title"
          className={cn(errors?.title ? "ring ring-destructive" : "")}
          defaultValue={book?.title ?? ""}
        />
        {errors?.title ? (
          <p className="text-xs text-destructive mt-2">{errors.title[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.authorId ? "text-destructive" : "",
          )}
        >
          Author Id
        </Label>
        <Select defaultValue={book?.authorId} name="authorId">
          <SelectTrigger
            className={cn(errors?.authorId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a author" />
          </SelectTrigger>
          <SelectContent>
            {authors?.map((author) => (
              <SelectItem key={author.id} value={author.id.toString()}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.authorId ? (
          <p className="text-xs text-destructive mt-2">{errors.authorId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <SaveButton errors={hasErrors} editing={editing} />
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic({ action: "delete", data: book });
              const data = await deleteBookAction(book.id);
              setIsDeleting(false);
              const error = {
                error: data?.error ?? "Error",
                values: book,
              };

              onSuccess("delete", data ? error : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default BookForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
