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
import { useContext, useState, useTransition } from "react";
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { AuthorContext } from "./AuthorList";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

const AuthorForm = ({
  author,
  closeModal,
}: {
  author?: Author;
  closeModal?: () => void;
}) => {
  const [, startMutate] = useTransition();
  const { toast } = useToast();
  const authorCtx = useContext(AuthorContext);

  const editing = !!author?.id;

  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Author>(insertAuthorParams);

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast({
        title: `Failed to ${action}`,
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
    setErrors(null);
    const payload = Object.fromEntries(data.entries());
    try {
      const values = insertAuthorParams.parse(payload);
      startMutate(async () => {
        if (editing) {
          authorCtx.addOptimisticAuthor({
            data: { ...values, id: author.id, userId: author.userId },
            action: "update",
          });

          const data = await updateAuthorAction({ ...values, id: author.id });
          onSuccess("update", data);
        } else {
          authorCtx.addOptimisticAuthor({
            data: { ...values, id: "optimistic", userId: "" },
            action: "create",
          });
          const data = await createAuthorAction(values);
          onSuccess("create", data);
        }
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-4"}>
      <div>
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
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={author?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div className="">
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.location ? "text-destructive" : "",
          )}
        >
          Location
        </Label>
        <Input
          type="text"
          name="location"
          className={cn(errors?.location ? "ring ring-destructive" : "")}
          defaultValue={author?.location ?? ""}
        />
        {errors?.location ? (
          <p className="text-xs text-destructive mt-2">{errors.location[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <SaveButton editing={editing} errors={hasErrors} />
      {editing ? (
        <Button
          type="button"
          variant={"destructive"}
          onClick={async () => {
            startMutate(async () => {
              setIsDeleting(true);
              authorCtx.addOptimisticAuthor({
                data: author,
                action: "delete",
              });

              await deleteAuthorAction(author.id);
              setIsDeleting(false);
              onSuccess("delete");
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default AuthorForm;

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
