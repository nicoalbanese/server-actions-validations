import AuthorList from "@/components/authors-sa-complete-rewrite/AuthorList";
import { checkAuth } from "@/lib/auth/utils";
import { getAuthors } from "@/lib/api/authors/queries";

export default async function Authors() {
  await checkAuth();
  const { authors } = await getAuthors();

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">
            Authors - complete rewrite
          </h1>
        </div>
        <AuthorList authors={authors} />
      </div>
    </main>
  );
}
