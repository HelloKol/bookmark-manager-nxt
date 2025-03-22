import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12 mx-auto">
        <div className="flex flex-col gap-2 md:w-1/3">
          <div className="flex gap-2 items-center text-xl font-bold">
            <Bookmark className="h-6 w-6" />
            <span>BookmarkPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The smart way to save and organize your bookmarks.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Extensions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col gap-3 border-t py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BookmarkPro. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Twitter
          </Link>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            LinkedIn
          </Link>
          <Link
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
