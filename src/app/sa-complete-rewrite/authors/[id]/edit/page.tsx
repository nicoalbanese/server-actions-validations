import AuthorForm from "@/components/authors-sa-complete-rewrite/AuthorForm";
import { getAuthorById } from "@/lib/api/authors/queries";
import { notFound } from "next/navigation";

export default async function AuthorPage({
  params,
}: {
  params: { id: string };
}) {
  const { authors: author } = await getAuthorById(params.id);
  if (!author) return notFound();
  return (
    <main className="">
      <AuthorForm author={author} />
    </main>
  );
}
