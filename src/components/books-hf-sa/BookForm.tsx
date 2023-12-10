import { Book, NewBookParams, insertBookParams } from "@/lib/db/schema/books";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useState, useTransition } from "react";
import { Author } from "@/lib/db/schema/authors";

import { TAddOptimistic } from "@/app/books-hf-sa/useOptimisticBooks";
import { Action } from "@/lib/utils";

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
  const { toast } = useToast();
  const editing = !!book?.id;

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof insertBookParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertBookParams),
    defaultValues: book ?? {
      title: "",
      authorId: "",
    },
  });

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

  const handleSubmit = (values: NewBookParams) => {
    editing ? setIsUpdating(true) : setIsCreating(true);
    closeModal && closeModal();
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

      let data;
      if (editing) {
        data = await updateBookAction({ ...values, id: book.id });
        setIsUpdating(false);
      } else {
        data = await createBookAction(values);
        setIsCreating(false);
      }

      const error = {
        error: data?.error ?? "Error",
        values: editing
          ? { ...book, ...values }
          : { ...values, id: "", userId: "" },
      };
      onSuccess(editing ? "update" : "create", data ? error : undefined);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Id</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors?.map((author) => (
                      <SelectItem key={author.id} value={author.id.toString()}>
                        {author.name}{" "}
                        {/* TODO: Replace with a field from the author model */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating || pending}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            disabled={isDeleting || pending}
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
    </Form>
  );
};

export default BookForm;
