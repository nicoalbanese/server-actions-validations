import BookList from "@/components/books/BookList";
import NewBookModal from "@/components/books/BookModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Books() {
  await checkAuth();
  const { books } = await api.books.getBooks.query();  

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Books</h1>
        <NewBookModal />
      </div>
      <BookList books={books} />
    </main>
  );
}
