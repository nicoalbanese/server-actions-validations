"use client";

import {
  Author,
  NewAuthorParams,
  insertAuthorParams,
} from "@/lib/db/schema/authors";

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
import { FormEvent, useContext, useState, useTransition } from "react";
import { Label } from "../ui/label";
import { useFormStatus } from "react-dom";
import { AddOptimisticFn, cn } from "@/lib/utils";

type AuthorZodErrors = Partial<
  Record<keyof NewAuthorParams, string[] | undefined>
>;

const AuthorForm = ({
  author,
  addOptimisticAuthor,
  closeModal,
}: {
  author?: Author;
  addOptimisticAuthor: AddOptimisticFn<Author>;
  closeModal?: () => void;
}) => {
  const [, startMutate] = useTransition();
  const { toast } = useToast();

  const editing = !!author?.id;

  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<AuthorZodErrors | null>(null);
  const hasErrors =
    errors !== null &&
    Object.values(errors).some((error) => error !== undefined);

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
      try {
      } catch (e) {
        console.error(e);
      }
      startMutate(async () => {
        if (editing) {
          addOptimisticAuthor({
            data: { ...values, id: author.id, userId: author.userId },
            action: "update",
          });

          const data = await updateAuthorAction({ ...values, id: author.id });
          onSuccess("update", data);
        } else {
          addOptimisticAuthor({
            data: { ...values, id: "optimistic", userId: "" },
            action: "create",
          });
          const data = await createAuthorAction(values);
          onSuccess("create", data);
        }
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors as AuthorZodErrors);
      }
    }
  };

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const target = event.target as EventTarget;
    if (target instanceof HTMLInputElement) {
      const field = target.name as keyof NewAuthorParams;
      const result = insertAuthorParams.safeParse({
        [field]: target.value,
      });
      const fieldError = result.success
        ? undefined
        : result.error.flatten().fieldErrors[field];

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError,
      }));
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
              addOptimisticAuthor({
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
