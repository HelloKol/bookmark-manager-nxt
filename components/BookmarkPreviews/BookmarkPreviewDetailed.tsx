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

interface LinkPreviewDetailedProps {
  preview: Preview;
}

const LinkPreviewDetailed: React.FC<LinkPreviewDetailedProps> = ({
  preview,
}) => {
  // Extract the domain from the ogUrl
  const ogUrl = preview?.ogUrl ? new URL(preview.ogUrl) : null;
  const domain = ogUrl?.origin || "";

  // Handle favicon URL construction
  const faviconUrl = preview.favicon
    ? preview.favicon?.startsWith("https://")
      ? preview.favicon
      : `${domain}${preview.favicon?.startsWith("/") ? "" : "/"}${
          preview.favicon || ""
        }`
    : "/placeholder-600x400.png";

  return (
    <Link
      href={preview.requestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="col-span-4 bg-[#242424] p-5 rounded-lg mb-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="mb-5"
        src={faviconUrl}
        alt="Preview Image"
        style={{ width: "50px" }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview?.ogImage?.[0]?.url || "/placeholder-600x400.png"}
        alt="Preview Image"
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h2>{preview.ogTitle}</h2>
      <p className="line-clamp-1 mb-2">{preview.ogDescription}</p>
      <p>{preview.requestUrl}</p>
    </Link>
  );
};

export default LinkPreviewDetailed;
