import React from "react";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, trigger }) => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenuRoot>
  );
};

export default DropdownMenu;
