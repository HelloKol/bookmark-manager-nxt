import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Header/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/Header/sheet";
import { Bookmark, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex mx-auto h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center text-xl font-bold">
          <Bookmark className="h-6 w-6" />
          <span>BookmarkPro</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </button>
            <Button variant="outline" size="sm" className="ml-2">
              <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/login`}>
                Log in
              </Link>
            </Button>
            <Button size="sm">
              <Link href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/register`}>
                Sign up free
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex gap-2 items-center text-xl font-bold">
                    <Bookmark className="h-6 w-6" />
                    <span>BookmarkPro</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col p-4 space-y-4">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    How It Works
                  </button>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="flex w-full items-center py-2 text-lg font-medium"
                  >
                    Pricing
                  </button>
                </nav>
                <div className="mt-auto p-4 border-t">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/login`}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button className="w-full">
                      <Link
                        href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/register`}
                      >
                        Sign up free
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
