import React from "react";
import { logout } from "@/lib/auth";
import SearchInput from "@/components/SearchInput";

interface SearchbarHeaderProps {
  loading: boolean;
}

const SearchbarHeader: React.FC<SearchbarHeaderProps> = ({ loading }) => {
  return (
    <div className="flex items-center justify-between mb-4 gap-10">
      <div className="relative w-full">
        <SearchInput placeholder="Search bookmarks" type="search" />
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2 text-muted-foreground">
          <kbd className="inline-flex h-5 max-h-full items-center rounded border border-border px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
            ⌘K
          </kbd>
        </div>
      </div>

      <button onClick={logout} disabled={loading}>
        Logout
      </button>
    </div>
  );
};

export default SearchbarHeader;
