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

function sleep(ms = 2000): Promise<void> {
  console.log("Kindly remember to remove `sleep`");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const revalidateAuthors = () => revalidatePath("/authors-sa-native");

export const createAuthorAction = async (input: NewAuthorParams) => {
  await sleep();
  try {
    const payload = insertAuthorParams.parse(input);
    await createAuthor(payload);
    revalidateAuthors();
  } catch (e) {
    return { error: "Error" };
  }
};

export const updateAuthorAction = async (input: UpdateAuthorParams) => {
  await sleep();
  try {
    const payload = updateAuthorParams.parse(input);
    await updateAuthor(payload.id, payload);
    revalidateAuthors;
  } catch (e) {
    return { error: "Error" };
  }
};

export const deleteAuthorAction = async (input: AuthorId) => {
  await sleep();
  try {
    const payload = authorIdSchema.parse({ id: input });
    await deleteAuthor(payload.id);
    revalidateAuthors();
  } catch (e) {
    return { error: "Error" };
  }
};
