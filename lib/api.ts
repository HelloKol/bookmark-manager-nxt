import {
  SaveLinksRequest,
  SaveLinksResponse,
  Bookmark,
  FolderBasic,
} from "@/types";

// Common error handling
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }
  return response.json() as Promise<T>;
};

/**
 * Type-safe API client for the bookmark manager application
 */
class ApiClient {
  /**
   * Save links to the user's bookmarks
   * @param payload Request payload containing URLs and user info
   * @returns Promise with the save operation result
   */
  async saveLinks(payload: SaveLinksRequest): Promise<SaveLinksResponse> {
    const response = await fetch("/api/saveLinks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return handleApiResponse<SaveLinksResponse>(response);
  }

  /**
   * Delete a bookmark by its ID
   * @param userId User ID
   * @param bookmarkId Bookmark ID to delete
   * @param folderId Optional folder ID if bookmark is in a folder
   */
  async deleteBookmark(
    userId: string,
    bookmarkId: string,
    folderId?: string
  ): Promise<{ success: boolean }> {
    const response = await fetch("/api/deleteBookmark", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, bookmarkId, folderId }),
    });

    return handleApiResponse<{ success: boolean }>(response);
  }

  /**
   * Create a new folder
   * @param userId User ID
   * @param folderName Name for the new folder
   */
  async createFolder(userId: string, folderName: string): Promise<FolderBasic> {
    const response = await fetch("/api/createFolder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, folderName }),
    });

    return handleApiResponse<FolderBasic>(response);
  }

  /**
   * Update a bookmark
   * @param userId User ID
   * @param bookmarkId Bookmark ID to update
   * @param folderId Current folder ID
   * @param data Updated bookmark data
   * @param newFolderId Optional new folder ID if moving the bookmark
   */
  async updateBookmark(
    userId: string,
    bookmarkId: string,
    folderId: string,
    data: Partial<Omit<Bookmark, "id">>,
    newFolderId?: string
  ): Promise<Bookmark> {
    const response = await fetch("/api/updateBookmark", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        bookmarkId,
        folderId,
        data,
        newFolderId,
      }),
    });

    return handleApiResponse<Bookmark>(response);
  }
}

// Export a singleton instance
const api = new ApiClient();
export default api;
