import { Button } from "@/components/ui/button";
import { getAuthorById } from "@/lib/api/authors/queries";
import Link from "next/link";

export default async function AuthorPage({
  params,
}: {
  params: { id: string };
}) {
  const { authors } = await getAuthorById(params.id);
  return (
    <main className="">
      <pre className="bg-card p-4 my-4">{JSON.stringify(authors, null, 2)}</pre>
      <Button asChild>
        <Link href={`/sa-complete-rewrite/authors/${params.id}/edit`}>
          Edit
        </Link>
      </Button>
    </main>
  );
}
