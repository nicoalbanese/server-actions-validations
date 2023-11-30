"use client";

import { Author, insertAuthorParams } from "@/lib/db/schema/authors";

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
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type AuthorZodErrors = Record<keyof Author, string[]>;

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

  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<AuthorZodErrors | null>(null);

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

  const handleSubmit = async (data: FormData) => {
    // need to handle errors
    setErrors(null);
    const payload = Object.fromEntries(data.entries());
    try {
      const values = insertAuthorParams.parse(payload);
      if (editing) {
        await updateAuthorAction({ ...values, id: author.id });
        onSuccess("update");
      } else {
        await createAuthorAction(values);
        onSuccess("create");
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors as AuthorZodErrors);
      }
    }
  };
  return (
    <form action={handleSubmit} className={"space-y-8"}>
      <div className="">
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(
            errors?.name ? "ring ring-destructive ring-offset-destructive" : "",
          )}
          defaultValue={author?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : null}
      </div>
      <SaveButton editing={editing} />
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
  );
};

export default AuthorForm;

const SaveButton = ({ editing }: { editing: Boolean }) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-1"
      disabled={isCreating || isUpdating}
      aria-disabled={isCreating || isUpdating}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
