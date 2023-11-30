import AuthorList from "@/components/authors-sa-native/AuthorList";
import NewAuthorModal from "@/components/authors-sa-native/AuthorModal";
import { checkAuth } from "@/lib/auth/utils";
import { getAuthors } from "@/lib/api/authors/queries";

export default async function Authors() {
  await checkAuth();
  const { authors } = await getAuthors();

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
