import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ProfileDropdown from "@/components/ProfileDropdown";
import * as Dialog from "@radix-ui/react-dialog";
import { useHotkeys } from "react-hotkeys-hook";

interface SearchbarHeaderProps {
  loading: boolean;
}

const SearchbarHeader: React.FC<SearchbarHeaderProps> = ({ loading }) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Handle ⌘K / Ctrl+K shortcut
  useHotkeys("meta+k, ctrl+k", (e) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsSearchModalOpen(true);
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-10">
        <div className="relative w-full">
          <SearchInput placeholder="Search bookmarks" type="search" />
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-4 text-muted-foreground">
            <kbd className="inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              ⌘K
            </kbd>
          </div>
        </div>
        <ProfileDropdown loading={loading} />
      </div>

      {/* Search Modal */}
      <Dialog.Root open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg">
            <SearchInput
              placeholder="Search bookmarks"
              type="search"
              autoFocus
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default SearchbarHeader;
