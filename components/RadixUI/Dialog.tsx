import React from "react";
import { Root, Content, Portal, Overlay } from "@radix-ui/react-dialog";

interface DialogProps {
  children: React.ReactNode;
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dialog: React.FC<DialogProps> = ({
  children,
  isDialogOpen,
  setDialogOpen,
}) => {
  return (
    <Root open={isDialogOpen} onOpenChange={setDialogOpen}>
      <Portal>
        <Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <div className="bg-[#242424] text-white rounded-lg shadow-lg p-6 w-96">
            {children}
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default Dialog;
