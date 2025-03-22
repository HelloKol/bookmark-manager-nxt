import { Button } from "@/components/LoginForm/button";
import { CheckCircle } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Choose the plan that&apos;s right for you.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-muted-foreground">
                Perfect for getting started
              </p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $0
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Up to 100 bookmarks</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Basic tagging</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Browser extension</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Mobile access</span>
              </li>
            </ul>
            <Button className="mt-auto">Get Started</Button>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm relative">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="text-muted-foreground">For power users</p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $9.99
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Unlimited bookmarks</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Advanced tagging</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Full-text search</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Bookmark collections</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button className="mt-8" variant="default">
              Subscribe Now
            </Button>
          </div>
          <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Team</h3>
              <p className="text-muted-foreground">For teams and businesses</p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $19.99
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Team sharing</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Admin controls</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>Usage analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                <span>API access</span>
              </li>
            </ul>
            <Button className="mt-8" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
