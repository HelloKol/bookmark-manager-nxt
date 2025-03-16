import React, { useState } from "react";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

export default function Home() {
  const [urls, setUrls] = useState<string[]>([]); // State to store array of URLs
  const [previews, setPreviews] = useState<Preview[]>([]); // State to store metadata for each link
  const [loading, setLoading] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState<string>("");

  console.log(previews);
  const handleFetchMetadata = async () => {
    if (urls.length === 0) return;

    setLoading(true);
    setPreviews([]); // Clear previous previews

    try {
      const metadataPromises = urls.map(async (url) => {
        // Remove trailing slash from the URL if it exists
        const cleanUrl = url.replace(/\/$/, "");

        const res = await fetch("/api/fetchMetadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: cleanUrl }), // Send the cleaned URL
        });

        const data = await res.json();
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.error);
        }
      });

      // Wait for all metadata to be fetched
      const metadata = await Promise.all(metadataPromises);
      setPreviews(metadata); // Set the fetched metadata for all links
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in textarea (split URLs by newline)
  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);

    const urlsArray = value
      .split("\n") // Split by new lines
      .map((url) => url.trim())
      .filter((url) => url); // Filter out empty URLs
    setUrls(urlsArray);
  };

  // Handle keydown event to detect Enter or Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // If Shift is not held, we prevent the default action to avoid new line and fetch metadata
      if (!e.shiftKey) {
        e.preventDefault();
        handleFetchMetadata();
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Link Preview App</h1>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          value={textAreaValue} // Use the local state for textarea value
          onChange={handleUrlsChange}
          onKeyDown={handleKeyDown} // Add keydown event handler
          placeholder="Paste URLs here, one per line"
          rows={10}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        />
        <button onClick={handleFetchMetadata} disabled={loading}>
          {loading ? "Loading..." : "Fetch Previews"}
        </button>
      </div>

      {previews.length > 0 &&
        previews.map((preview, index) => {
          // Step 1: Extract the domain from the ogUrl
          const ogUrl =
            preview?.ogUrl !== "" && preview.ogUrl !== undefined
              ? new URL(preview.ogUrl)
              : { origin: "" };
          const domain = ogUrl.origin; // This will give you "https://www.lookfantastic.com"
          // Step 2: Combine the domain with the relative favicon path
          const faviconUrl = `${domain}${preview.favicon}`;

          return (
            <div
              key={index}
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

              {preview.ogImage?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.ogImage[0].url}
                  alt="Preview Image"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}

              <h2>{preview.ogTitle || "No title found"}</h2>
              <p>{preview.ogDescription || "No description found"}</p>
              <a
                href={preview.requestUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Site
              </a>
            </div>
          );
        })}
    </div>
  );
}
