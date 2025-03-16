import Link from "next/link";
import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface Folder {
  id: string;
  name: string;
}

interface LinkPreviewBasicProps {
  preview: Preview;
  currentFolderId: string;
  folders: Folder[];
  onDelete: (linkRequestUrl: string) => void;
  onEdit: (
    oldLink: Preview,
    newRequestUrl: string,
    newFolderId: string
  ) => void;
}

const LinkPreviewBasic: React.FC<LinkPreviewBasicProps> = ({
  preview,
  currentFolderId,
  folders,
  onDelete,
  onEdit,
}) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState(preview.requestUrl);
  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId);

  const handleDeleteClick = () => {
    onDelete(preview.requestUrl);
  };

  const handleEditSubmit = () => {
    onEdit(preview, newUrl, selectedFolderId);
    setDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between space-x-4 p-2 border border-gray-600 rounded-md">
      <Link
        href={preview.requestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-400 text-lg"
      >
        {preview.requestUrl}
      </Link>

      {/* Dropdown Menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-white">
            ⋮
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="bg-white shadow-md rounded-md p-2 text-sm">
          <DropdownMenu.Item
            className="cursor-pointer p-2 hover:bg-gray-100"
            onSelect={() => setDialogOpen(true)}
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer p-2 hover:bg-gray-100 text-red-600"
            onSelect={handleDeleteClick}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-white p-6 rounded-md shadow-md -translate-x-1/2 -translate-y-1/2 space-y-4">
            <Dialog.Title className="text-lg font-bold">
              Edit Bookmark
            </Dialog.Title>
            <div className="flex flex-col space-y-2">
              <label className="text-sm">URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="border p-2 rounded"
              />

              <label className="text-sm">Folder</label>
              <Select.Root
                value={selectedFolderId}
                onValueChange={setSelectedFolderId}
              >
                <Select.Trigger className="border p-2 rounded text-left">
                  {folders.find((f) => f.id === selectedFolderId)?.name ||
                    "Select folder"}
                </Select.Trigger>
                <Select.Content className="bg-white shadow-md rounded">
                  {folders.map((folder) => (
                    <Select.Item
                      key={folder.id}
                      value={folder.id}
                      className="p-2 hover:bg-gray-100"
                    >
                      {folder.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

              <button
                onClick={handleEditSubmit}
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default LinkPreviewBasic;
