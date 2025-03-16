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

interface LinkPreviewBasicProps {
  preview: Preview;
}

const LinkPreviewBasic: React.FC<LinkPreviewBasicProps> = ({ preview }) => {
  return (
    <Link
      href={preview.requestUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-amber-400 p-2 text-lg w-fit"
    >
      {preview.requestUrl}
    </Link>
  );
};

export default LinkPreviewBasic;
