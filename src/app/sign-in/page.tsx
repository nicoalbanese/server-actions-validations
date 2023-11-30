import AuthForm from "@/components/auth/Form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPageSession } from "@/lib/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getPageSession();
  if (session?.user) redirect("/");
  return (
    <main className="max-w-lg mx-auto my-4 bg-card p-10">
      <h1 className="text-2xl font-bold text-center">
        Sign in to your account
      </h1>
      <AuthForm action="/api/sign-in">
        <Label htmlFor="username" className="text-muted-foreground">
          Username
        </Label>
        <Input name="username" id="username" />
        <br />
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input type="password" name="password" id="password" />
        <br />
      </AuthForm>
      <div className="mt-4 text-sm text-center text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/sign-up"
          className="text-accent-foreground underline hover:text-primary"
        >
          Create an account
        </Link>
      </div>
    </main>
  );
};

export default Page;
