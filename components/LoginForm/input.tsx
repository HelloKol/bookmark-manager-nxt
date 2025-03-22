import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-black/30 px-3 py-2 text-sm text-black shadow-sm shadow-black/5 transition-shadow placeholder:text-black/30 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-50",
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 italic text-black/30 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-black/30 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-black",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
