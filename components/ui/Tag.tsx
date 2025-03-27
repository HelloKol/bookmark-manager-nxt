import React from "react";
import { X } from "lucide-react";

interface TagProps {
  text: string;
  onRemove?: () => void;
  className?: string;
  interactive?: boolean;
}

/**
 * Tag component for displaying labels
 * Can be used as interactive (with remove button) or static
 */
export const Tag: React.FC<TagProps> = ({
  text,
  onRemove,
  className = "",
  interactive = true,
}) => {
  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-1 
        text-xs rounded-full bg-gray-100 text-gray-800
        ${interactive ? "pr-1" : "pr-2"}
        ${className}
      `}
    >
      <span className="truncate max-w-[100px]">{text}</span>
      {interactive && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-1 hover:bg-gray-200 flex items-center justify-center"
          aria-label={`Remove ${text} tag`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};

/**
 * Tag list component for displaying multiple tags
 */
export const TagList: React.FC<{
  tags: string[];
  onRemove?: (index: number) => void;
  className?: string;
  interactive?: boolean;
}> = ({ tags, onRemove, className = "", interactive = true }) => {
  if (!tags.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Tag
          key={`${tag}-${index}`}
          text={tag}
          onRemove={onRemove ? () => onRemove(index) : undefined}
          interactive={interactive}
        />
      ))}
    </div>
  );
};
