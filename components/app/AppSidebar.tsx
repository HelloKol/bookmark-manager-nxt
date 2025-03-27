import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/app/Sidebar/sidebar";
import FileTree from "@/components/app/FileTree/FileTree";
import Link from "next/link";
import { Bookmark, Tag } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center text-xl font-bold">
          <Bookmark className="h-6 w-6" />
          <span>BookmarkPro</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/" className="text-base">
              View all
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupLabel>
            <Link href="/uncategorised" className="text-base">
              Uncategorised
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupLabel>
            <Link
              href="/app/tags"
              className="text-base flex items-center gap-2"
            >
              <Tag className="h-4 w-4" />
              Tags
            </Link>
          </SidebarGroupLabel>
          <FileTree />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
