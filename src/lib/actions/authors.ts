"use server";

import { revalidatePath } from "next/cache";
import {
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "../api/authors/mutations";
import {
  AuthorId,
  NewAuthorParams,
  UpdateAuthorParams,
  authorIdSchema,
  insertAuthorParams,
  updateAuthorParams,
} from "../db/schema/authors";

function sleep(ms = 1000): Promise<void> {
  console.log("Kindly remember to remove `sleep`");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const revalidateAuthors = () => revalidatePath("/sa-complete-rewrite/authors");

export const createAuthorAction = async (input: NewAuthorParams) => {
  try {
    const payload = insertAuthorParams.parse(input);
    await createAuthor(payload);
    revalidateAuthors();
  } catch (e) {
    return { error: "Error" };
  }
};

export const updateAuthorAction = async (input: UpdateAuthorParams) => {
  try {
    const payload = updateAuthorParams.parse(input);
    await updateAuthor(payload.id, payload);
    revalidateAuthors;
  } catch (e) {
    return { error: "Error" };
  }
};

export const deleteAuthorAction = async (input: AuthorId) => {
  try {
    const payload = authorIdSchema.parse({ id: input });
    await deleteAuthor(payload.id);
    revalidateAuthors();
  } catch (e) {
    return { error: "Error" };
  }
};
