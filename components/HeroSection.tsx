import { Button } from "@/components/LoginForm/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Save and organize <br />
              your bookmarks in one place
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              BookmarkPro helps you save, organize, and access your favorite
              websites from anywhere. Never lose an important link again.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/register`}>
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See Features</Link>
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-7xl overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/static/hero.png"
              width={800}
              height={500}
              alt="Bookmark manager dashboard preview"
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
