"use client";

import { Author, NewAuthorParams, insertAuthorParams } from "@/lib/db/schema/authors";
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
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const AuthorForm = ({
  author,
  closeModal,
}: {
  author?: Author;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!author?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertAuthorParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertAuthorParams),
    defaultValues: author ?? {
      name: ""
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
        if (data?.error) {
      toast({
        title: `${action
          .slice(0, 1)
          .toUpperCase()
          .concat(action.slice(1))} Failed`,
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    await utils.authors.getAuthors.invalidate();
    router.refresh();
    if (closeModal) closeModal();
        toast({
      title: 'Success',
      description: `Author ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createAuthor, isLoading: isCreating } =
    trpc.authors.createAuthor.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateAuthor, isLoading: isUpdating } =
    trpc.authors.updateAuthor.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteAuthor, isLoading: isDeleting } =
    trpc.authors.deleteAuthor.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewAuthorParams) => {
    if (editing) {
      updateAuthor({ ...values, id: author.id });
    } else {
      createAuthor(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
              <FormLabel>Name</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteAuthor({ id: author.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default AuthorForm;
