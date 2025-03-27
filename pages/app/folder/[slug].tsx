import React from "react";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/AppProvider";
import Bookmarks from "@/components/Bookmarks";
import CreateNewBookmark from "@/components/CreateNewBookmark";
import DeleteAllBookmark from "@/components/DeleteAllBookmark";
import ImportBookmark from "@/components/ImportBookmark";
import { useFetchFoldersList } from "@/hooks/queries/useFetchFolders";

const FolderPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const { slug } = router.query;

  // Use the basic folders list hook since we only need minimal data here
  const foldersQuery = useFetchFoldersList();

  // Find the current folder based on the slug
  const folder = foldersQuery.data?.find((f) => f.slug === slug);

  // Use isPending to check both initial loading and enabled state changes
  if (foldersQuery.isPending || foldersQuery.isLoading)
    return <p>Loading folder...</p>;
  if (foldersQuery.isError)
    return <p>Error loading folder: {(foldersQuery.error as Error).message}</p>;
  if (!folder) return <p>Folder not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Folder: {folder.name}</h1>{" "}
      <div className="flex justify-end w-full mb-4">
        <DeleteAllBookmark folderId={folder.id} />
        <CreateNewBookmark
          folderId={folder.id}
          folders={foldersQuery.data || []}
        />
        <ImportBookmark folderId={folder?.id} />
      </div>
      <Bookmarks user={user} folderId={folder.id} />
    </div>
  );
};

export default FolderPage;
