import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface BookmarkPreviewDetailedProps {
  preview: Preview;
}

const BookmarkPreviewDetailed: React.FC<BookmarkPreviewDetailedProps> = ({
  preview,
}) => {
  // Extract the domain from the ogUrl
  const ogUrl = preview?.ogUrl ? new URL(preview.ogUrl) : null;
  const domain = ogUrl?.origin || "";

  // Handle favicon URL construction
  const faviconUrl = preview.favicon
    ? preview.favicon?.startsWith("https://") ||
      preview.favicon?.startsWith("//www.") ||
      preview.favicon?.startsWith("www.")
      ? preview.favicon
      : `${domain}${preview.favicon?.startsWith("/") ? "" : "/"}${
          preview.favicon || ""
        }`
    : "/static/placeholder-600x400.png";

  return (
    <Link
      href={preview.requestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg"
    >
      <div className="h-[300px] relative overflow-hidden mb-5">
        <Image
          src={preview?.ogImage?.[0]?.url || "/static/placeholder-600x400.png"}
          alt="Preview Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex gap-4 items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="h-6 w-6" src={faviconUrl} alt="Preview Image" />
        <div className="w-full overflow-hidden">
          <h2 className="whitespace-nowrap overflow-hidden text-ellipsis text-lg">
            {preview.ogTitle}
          </h2>
          <p className="whitespace-nowrap overflow-hidden text-ellipsis">
            {preview.requestUrl}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookmarkPreviewDetailed;
