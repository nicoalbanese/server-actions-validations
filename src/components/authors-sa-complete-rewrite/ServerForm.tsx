import { getAuthors } from "@/lib/api/authors/queries";
import AuthorForm from "./AuthorForm";

export async function ServerForm() {
  const { authors } = await getAuthors();
  return <AuthorForm authors={authors} />;
}
