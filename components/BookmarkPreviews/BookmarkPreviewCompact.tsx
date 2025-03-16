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

interface LinkPreviewCompactProps {
  preview: Preview;
}

const LinkPreviewCompact: React.FC<LinkPreviewCompactProps> = ({ preview }) => {
  // Extract the domain from the ogUrl
  const ogUrl = preview?.ogUrl ? new URL(preview.ogUrl) : null;
  const domain = ogUrl?.origin || "";

  // Handle favicon URL construction
  const faviconUrl = preview.favicon?.startsWith("https://")
    ? preview.favicon
    : `${domain}${preview.favicon?.startsWith("/") ? "" : "/"}${
        preview.favicon || ""
      }`;

  return (
    <Link
      href={preview.requestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex p-3 rounded-lg mb-4 items-center gap-4 bg-[#242424]"
    >
      {preview.favicon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="mb-5"
          src={faviconUrl}
          alt="Preview Image"
          style={{ width: "50px" }}
        />
      )}

      <div>
        <p>{preview.ogTitle}</p>
        <p>{preview.requestUrl}</p>
      </div>
    </Link>
  );
};

export default LinkPreviewCompact;
