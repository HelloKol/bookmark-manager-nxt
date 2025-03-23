import React, { useState } from "react";
import SearchInput from "@/components/SearchInput";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useHotkeys } from "react-hotkeys-hook";
import { useAppContext } from "@/context/AppProvider";
import Link from "next/link";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
          <Link
            href={`${process.env.NEXT_PUBLIC_SUB_DOMAIN}/login`}
            className="text-blue-500"
          >
            Login
          </Link>
        )}
      </div>

      {/* Search Modal */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-[525px] p-0" hideCloseButton={true}>
          <SearchInput placeholder="Search bookmarks" type="search" autoFocus />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchbarHeader;
