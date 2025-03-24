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

const fileTreeData = [
  {
    name: "Project Files",
    type: "folder" as const,
    children: [
      { name: "package.json", type: "file" as const },
      { name: "tsconfig.json", type: "file" as const },
      { name: "README.md", type: "file" as const },
    ],
  },
  {
    name: "src",
    type: "folder" as const,
    children: [
      { name: "index.ts", type: "file" as const },
      { name: "app.tsx", type: "file" as const },
      { name: "styles.css", type: "file" as const },
    ],
  },
  {
    name: "components",
    type: "folder" as const,
    children: [
      { name: "Button.tsx", type: "file" as const },
      { name: "Card.tsx", type: "file" as const },
      { name: "Input.tsx", type: "file" as const },
    ],
  },
  { name: ".gitignore", type: "file" as const },
  { name: ".env.example", type: "file" as const },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userLoading } = useAppContext();
  const state = useFetchFolders(user?.uid || null, userLoading);

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
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          {renderFileTree()}
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
