"use client";

import {
  Author,
  NewAuthorParams,
  insertAuthorParams,
} from "@/lib/db/schema/authors";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  createAuthorAction,
  deleteAuthorAction,
  updateAuthorAction,
} from "@/lib/actions/authors";
import { useState } from "react";

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

  const form = useForm<z.infer<typeof insertAuthorParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertAuthorParams),
    defaultValues: author ?? {
      name: "",
      location: "",
    },
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { formState } = form;

  const onSuccess = async (
    action: "create" | "update" | "delete",
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

    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Author ${action}d!`,
      variant: "default",
    });
  };

  const handleSubmit = async (values: NewAuthorParams) => {
    if (editing) {
      setIsUpdating(true);
      await updateAuthorAction({ ...values, id: author.id });
      setIsUpdating(false);
      onSuccess("update");
    } else {
      setIsCreating(true);
      await createAuthorAction(values);
      setIsCreating(false);
      onSuccess("create");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
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
            onClick={async () => {
              setIsDeleting(true);
              await deleteAuthorAction(author.id);
              setIsDeleting(false);
              onSuccess("delete");
            }}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default AuthorForm;
