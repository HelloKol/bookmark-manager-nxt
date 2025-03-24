import { ReactNode } from "react";
import { useRouter } from "next/router";
import { AppSidebar } from "@/components/app/AppSidebar";
import { Separator } from "@/components/app/Sidebar/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/app/Sidebar/sidebar";
import SearchbarHeader from "@/components/SearchbarHeader";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const excludeSidebarLayout = [
    "/app/login",
    "/app/register",
    "/app/change-password",
    "/app/reset-password",
  ].includes(router.pathname);

  // Exclude layout from auth pages
  if (excludeSidebarLayout) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <SearchbarHeader />
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
