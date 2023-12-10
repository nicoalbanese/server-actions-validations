import BookList from "@/components/books-sa/BookList";
import { checkAuth } from "@/lib/auth/utils";
import { getBooks } from "@/lib/api/books/queries";
import { getAuthors } from "@/lib/api/authors/queries";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Books() {
  await checkAuth();
  const { books } = await getBooks();
  const { authors } = await getAuthors();

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="relative">
        <div className="relative flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Books</h1>
        </div>
        <BookList books={books} authors={authors} />
      </div>
    </main>
  );
}
