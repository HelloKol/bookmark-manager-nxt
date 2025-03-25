import * as React from "react";
import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "default" | "large";
};

function Textarea({ className, variant = "default", ...props }: TextareaProps) {
  const variantClasses = cn({
    "bg-input/30 px-3 h-44 border border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-[3px] shadow-xs transition-[color,box-shadow] outline-none":
      variant === "default",
    "bg-none h-44 outline-none flex-grow": variant === "large",
  });

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "overflow-y-auto resize-none placeholder:text-muted-foreground flex field-sizing-content w-full rounded-md py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        variantClasses,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
