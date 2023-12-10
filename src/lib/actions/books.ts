"use server";

import { revalidatePath } from "next/cache";
import { createBook, deleteBook, updateBook } from "../api/books/mutations";
import {
  BookId,
  NewBookParams,
  UpdateBookParams,
  bookIdSchema,
  insertBookParams,
  updateBookParams,
} from "../db/schema/books";

const revalidateBooks = () => revalidatePath("/books-hf-sa");

export const createBookAction = async (input: NewBookParams) => {
  try {
    const payload = insertBookParams.parse(input);
    await createBook(payload);
    revalidateBooks();
  } catch (e) {
    return { error: "Error" };
  }
};

export const updateBookAction = async (input: UpdateBookParams) => {
  try {
    const payload = updateBookParams.parse(input);
    await updateBook(payload.id, payload);
    revalidateBooks();
  } catch (e) {
    return { error: "Error" };
  }
};

export const deleteBookAction = async (input: BookId) => {
  try {
    const payload = bookIdSchema.parse({ id: input });
    await deleteBook(payload.id);
    revalidateBooks();
  } catch (e) {
    return { error: "Error" };
  }
};
