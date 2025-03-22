import Image from "next/image";

export default function DemoSection() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              How BookmarkPro Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Get started in minutes and begin organizing your online world.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="text-xl font-bold">Install Extension</h3>
            <p className="text-center text-muted-foreground">
              Add our browser extension to Chrome, Firefox, Safari, or Edge.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="text-xl font-bold">Save Bookmarks</h3>
            <p className="text-center text-muted-foreground">
              Click the BookmarkPro icon to save any webpage you&apos;re
              visiting.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="text-xl font-bold">Organize & Access</h3>
            <p className="text-center text-muted-foreground">
              Tag, categorize, and access your bookmarks from any device.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="relative w-full overflow-hidden rounded-xl border shadow-xl">
            <Image
              src="/static/demo.png"
              width={1200}
              height={600}
              alt="BookmarkPro workflow demonstration"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
