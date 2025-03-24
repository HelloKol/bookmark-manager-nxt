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
  return (
    <Sidebar {...props}>
      <SidebarHeader>LOGO</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Folders</SidebarGroupLabel>
          <FileTree items={fileTreeData} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
