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
import { useAppContext } from "@/context/AppProvider";
import { useFetchFolders } from "@/hooks/data/useFetchFolders";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateNewFolder from "../CreateNewFolder";
import { Button } from "../ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userLoading } = useAppContext();
  const state = useFetchFolders(user?.uid || null, userLoading);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const renderFileTree = () => {
    if (state.status === "loading" || userLoading === "loading")
      return <p>Loading folders...</p>;
    if (state.status === "error") return <p>Error: {state.error}</p>;

    return <FileTree items={state.folders} />;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>LOGO</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/" className="text-sm">
              View all
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupLabel>
            <Link href="/uncategorised" className="text-sm">
              Uncategorised
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupLabel className="flex justify-between">
            <p className="text-sm">3 Collections</p>
            <Button
              variant={"ghost"}
              onClick={() => setIsFolderModalOpen(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>
            <CreateNewFolder
              isFolderModalOpen={isFolderModalOpen}
              setIsFolderModalOpen={setIsFolderModalOpen}
            />
          </SidebarGroupLabel>
          {renderFileTree()}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
