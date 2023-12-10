"use client";

import { z } from "zod";
import { Author, insertAuthorParams } from "@/lib/db/schema/authors";
import {
  createAuthorAction,
  deleteAuthorAction,
  updateAuthorAction,
} from "@/lib/actions/authors";
import { Action, cn } from "@/lib/utils";
import { AuthorContext } from "./AuthorList";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useContext, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";

const AuthorForm = ({
  author,
  closeModal,
  authors,
}: {
  author?: Author;
  closeModal?: () => void;
  authors?: Author[];
}) => {
  const router = useRouter();
  const [mutating, startMutate] = useTransition();
  const { toast } = useToast();
  const { addOptimisticAuthor } = useContext(AuthorContext);
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Author>(insertAuthorParams);
  const [isDeleting, setIsDeleting] = useState(false);

  const editing = !!author?.id;

  const onSuccess = (action: Action, data?: { error: string }) => {
    const failed = Boolean(data?.error);
    if (!failed) {
      router.refresh();
      closeModal && closeModal();
    }

    toast({
      title: failed ? "Failed" : "Success",
      description: failed ? `Failed to ${action}` : `Author ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);
    const payload = Object.fromEntries(data.entries());
    try {
      const values = insertAuthorParams.parse(payload);
      startMutate(async () => {
        addOptimisticAuthor({
          data: {
            ...values,
            id: editing ? author.id : "optimistic",
            userId: editing ? author.userId : "",
          },
          action: editing ? "update" : "create",
        });

        let data;
        if (editing) {
          data = await updateAuthorAction({ ...values, id: author.id });
        } else {
          data = await createAuthorAction(values);
        }
        onSuccess(editing ? "update" : "create", data);
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
          disabled={mutating}
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
          disabled={mutating}
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
              addOptimisticAuthor({
                data: author,
                action: "delete",
              });

              const data = await deleteAuthorAction(author.id);
              setIsDeleting(false);
              onSuccess("delete", data);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
      <pre>authors, {JSON.stringify(authors, null, 2)}</pre>
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
