import React from "react";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface LinkPreviewCardProps {
  preview: Preview;
}

const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({ preview }) => {
  // Extract the domain from the ogUrl
  const ogUrl =
    preview?.ogUrl !== "" && preview.ogUrl !== undefined
      ? new URL(preview.ogUrl)
      : { origin: "" };
  const domain = ogUrl.origin; // This will give you "https://www.lookfantastic.com"

  // Combine the domain with the relative favicon path
  const faviconUrl = `${domain}${preview.favicon}`;

  return (
    <div
      className="col-span-3"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        width: "400px",
        marginBottom: "1rem",
      }}
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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preview?.ogImage?.[0]?.url || "/placeholder-600x400.png"}
        alt="Preview Image"
        style={{ width: "100%", borderRadius: "8px" }}
      />

      <h2>{preview.ogTitle}</h2>
      <p>{preview.ogDescription}</p>
      <p>Link: {preview.requestUrl}</p>
    </div>
  );
};

export default LinkPreviewCard;
