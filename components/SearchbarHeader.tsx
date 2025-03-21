import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useHotkeys } from "react-hotkeys-hook";
import Dialog from "@/components/RadixUI/Dialog";
import { useAppContext } from "@/context/AppProvider";
import Link from "next/link";

const SearchbarHeader: React.FC = () => {
  const { user } = useAppContext();
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
        {user ? (
          <ProfileDropdown />
        ) : (
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        )}
      </div>

      {/* Search Modal */}
      <Dialog
        isDialogOpen={isSearchModalOpen}
        setDialogOpen={setIsSearchModalOpen}
      >
        <SearchInput placeholder="Search bookmarks" type="search" autoFocus />
      </Dialog>
    </>
  );
};

export default SearchbarHeader;
