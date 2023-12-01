import AuthForm from "@/components/auth/Form";
import { Button } from "@/components/ui/button";
import { getUserAuth } from "@/lib/auth/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { session } = await getUserAuth();
  if (!session) redirect("/sign-up");
  return (
    <main className="">
      <h1 className="text-2xl font-bold my-2">Profile</h1>
      <AuthForm action="/api/sign-out" />
      <ul className="mt-4 py-4 border-t">
        <li>
          <Button asChild variant="link">
            <Link href="/authors">TRPC</Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/authors-sa-hf">Server Actions w/ react hook form</Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/authors-sa-native">
              Server Actions w/ useOptimistic
            </Link>
          </Button>
        </li>
      </ul>
    </main>
  );
}
