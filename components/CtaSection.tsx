import { Button } from "@/components/LoginForm/button";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Ready to organize your online world?
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Join thousands of users who have transformed how they manage their
            bookmarks.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
          <Button size="lg" className="px-8">
            <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/register`}>
              Sign up free
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            <Link href={`#how-it-works`}>See Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
