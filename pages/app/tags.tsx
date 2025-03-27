import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TagList } from "@/components/ui/Tag";
import BookmarkPreviewDetailed from "@/components/BookmarkPreviews/BookmarkPreviewDetailed";
import { Bookmark } from "@/types";

interface TagWithCount {
  name: string;
  count: number;
}

interface BookmarkData {
  tags?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface FolderData {
  links?: Record<string, BookmarkData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function TagsPage() {
  const { user } = useAppContext();
  const [allTags, setAllTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // Fetch all unique tags when the component mounts
  useEffect(() => {
    const fetchTags = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // First, get standalone bookmarks
        const bookmarksDocRef = doc(db, "users", user.uid, "data", "bookmarks");
        const bookmarksDoc = await getDoc(bookmarksDocRef);

        // Then, get folders to extract bookmarks
        const foldersDocRef = doc(db, "users", user.uid, "data", "folders");
        const foldersDoc = await getDoc(foldersDocRef);

        // Collect all tags
        const tagCounts: Record<string, number> = {};

        // Process standalone bookmarks
        if (bookmarksDoc.exists()) {
          const bookmarksData = bookmarksDoc.data() as Record<
            string,
            BookmarkData
          >;
          Object.values(bookmarksData).forEach((bookmark) => {
            if (bookmark.tags && Array.isArray(bookmark.tags)) {
              bookmark.tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
              });
            }
          });
        }

        // Process folder bookmarks
        if (foldersDoc.exists()) {
          const foldersData = foldersDoc.data() as Record<string, FolderData>;
          Object.values(foldersData).forEach((folder) => {
            if (folder.links) {
              Object.values(folder.links).forEach((bookmark) => {
                if (bookmark.tags && Array.isArray(bookmark.tags)) {
                  bookmark.tags.forEach((tag: string) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                  });
                }
              });
            }
          });
        }

        // Convert to array and sort by count
        const tagsArray = Object.entries(tagCounts).map(([name, count]) => ({
          name,
          count,
        }));

        tagsArray.sort((a, b) => b.count - a.count);
        setAllTags(tagsArray);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [user]);

  // Fetch bookmarks filtered by selected tags
  useEffect(() => {
    const fetchFilteredBookmarks = async () => {
      if (!user || selectedTags.length === 0) {
        setFilteredBookmarks([]);
        return;
      }

      try {
        setBookmarksLoading(true);
        const matchedBookmarks: Bookmark[] = [];

        // Get standalone bookmarks
        const bookmarksDocRef = doc(db, "users", user.uid, "data", "bookmarks");
        const bookmarksDoc = await getDoc(bookmarksDocRef);

        // Get folder bookmarks
        const foldersDocRef = doc(db, "users", user.uid, "data", "folders");
        const foldersDoc = await getDoc(foldersDocRef);

        // Process standalone bookmarks
        if (bookmarksDoc.exists()) {
          const bookmarksData = bookmarksDoc.data() as Record<
            string,
            BookmarkData
          >;
          Object.entries(bookmarksData).forEach(([id, data]) => {
            if (data.tags && Array.isArray(data.tags)) {
              // Check if any of the selected tags exist in this bookmark's tags
              const hasMatchingTag = selectedTags.some((tag) =>
                data.tags!.includes(tag)
              );
              if (hasMatchingTag) {
                matchedBookmarks.push({
                  id,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ...(data as any),
                });
              }
            }
          });
        }

        // Process folder bookmarks
        if (foldersDoc.exists()) {
          const foldersData = foldersDoc.data() as Record<string, FolderData>;
          Object.entries(foldersData).forEach(([folderId, folderData]) => {
            if (folderData.links) {
              Object.entries(folderData.links).forEach(([linkId, data]) => {
                if (data.tags && Array.isArray(data.tags)) {
                  // Check if any of the selected tags exist in this bookmark's tags
                  const hasMatchingTag = selectedTags.some((tag) =>
                    data.tags!.includes(tag)
                  );
                  if (hasMatchingTag) {
                    matchedBookmarks.push({
                      id: linkId,
                      folderId,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ...(data as any),
                    });
                  }
                }
              });
            }
          });
        }

        setFilteredBookmarks(matchedBookmarks);
      } catch (error) {
        console.error("Error fetching filtered bookmarks:", error);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchFilteredBookmarks();
  }, [user, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Browse by Tags</h1>

      {loading ? (
        <p>Loading tags...</p>
      ) : allTags.length === 0 ? (
        <p>No tags found. Try adding tags to your bookmarks.</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Select tags to filter</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <div
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                className={`
                  cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 
                  rounded-full text-sm transition-colors
                  ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-100 text-blue-800 border border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }
                `}
              >
                <span>{tag.name}</span>
                <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5 ml-1">
                  {tag.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              Bookmarks with selected tags
            </h2>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600">Selected:</span>
              <TagList
                tags={selectedTags}
                onRemove={(index) => {
                  setSelectedTags((prev) => [
                    ...prev.slice(0, index),
                    ...prev.slice(index + 1),
                  ]);
                }}
              />
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {bookmarksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <p>No bookmarks found with the selected tags.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className="rounded overflow-hidden">
                  <BookmarkPreviewDetailed
                    preview={{
                      ...bookmark,
                      ogUrl: bookmark.url,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
