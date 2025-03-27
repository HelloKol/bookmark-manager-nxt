export interface Bookmark {
  id: string;
  url: string;
  title?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: { url: string }[];
  requestUrl: string;
  createdAt: string;
  [key: string]: string | object | number | boolean | undefined | null;
}

export interface SaveLinksRequest {
  urls: string[];
  userId: string;
  folderId?: string | null;
}

export interface SavedLink extends Bookmark {
  savedAt?: string;
  processedBy?: string;
}

export interface SaveLinksResponse {
  message: string;
  links: SavedLink[];
}

export interface SaveLinksErrorResponse {
  error: string;
}

export interface FolderBasic {
  id: string;
  name: string;
  slug: string;
}

export interface FolderDetailed extends FolderBasic {
  links: Record<string, Bookmark>;
}
