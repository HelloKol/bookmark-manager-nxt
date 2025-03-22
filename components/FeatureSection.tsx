import { Bookmark, Globe, Search, Share2, Shield, Tag } from "lucide-react";

export default function FeatureSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Everything you need to manage your bookmarks
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              BookmarkPro comes with all the tools you need to save, organize,
              and access your bookmarks efficiently.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">One-Click Save</h3>
            <p className="text-center text-muted-foreground">
              Save any webpage with a single click using our browser extension.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Smart Tags</h3>
            <p className="text-center text-muted-foreground">
              Organize bookmarks with tags for easy categorization and
              retrieval.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Powerful Search</h3>
            <p className="text-center text-muted-foreground">
              Find any bookmark instantly with our advanced search capabilities.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Access Anywhere</h3>
            <p className="text-center text-muted-foreground">
              Your bookmarks sync across all your devices and browsers.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Sharing Options</h3>
            <p className="text-center text-muted-foreground">
              Share collections of bookmarks with teammates or friends.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Secure Storage</h3>
            <p className="text-center text-muted-foreground">
              Your data is encrypted and securely stored in the cloud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
