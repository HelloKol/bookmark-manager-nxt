import React from "react";
import { Root, Trigger, Content } from "@radix-ui/react-dropdown-menu";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, trigger }) => {
  return (
    <Root>
      <Trigger asChild>{trigger}</Trigger>
      <Content
        sideOffset={10}
        align="end"
        className="bg-[#242424] w-44 shadow-md rounded-md p-2 text-sm"
      >
        {children}
      </Content>
    </Root>
  );
};

export default DropdownMenu;
