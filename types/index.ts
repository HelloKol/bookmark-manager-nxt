export interface Bookmark {
  id: string;
  title: string;
  url: string;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  slug: string;
  links: Record<string, Bookmark>;
}
