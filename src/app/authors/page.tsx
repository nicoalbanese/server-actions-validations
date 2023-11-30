import AuthorList from "@/components/authors/AuthorList";
import NewAuthorModal from "@/components/authors/AuthorModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Authors() {
  await checkAuth();
  const { authors } = await api.authors.getAuthors.query();  

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Authors</h1>
        <NewAuthorModal />
      </div>
      <AuthorList authors={authors} />
    </main>
  );
}
