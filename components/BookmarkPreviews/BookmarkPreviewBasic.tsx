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
          <button className="p-0 m-0 outline-none ring-0 inline-flex items-center justify-center cursor-pointer">
            <span className="text-2xl">⋮</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align="end"
          className="bg-[#242424] w-44 shadow-md rounded-md p-2 text-sm"
        >
          <DropdownMenu.Item
            className="cursor-pointer p-3 rounded-md text-[#AAAAAA] hover:text-white hover:bg-[#2E2E2E]"
            onSelect={() => setDialogOpen(true)}
          >
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer p-3 rounded-md hover:bg-[#2E2E2E] text-red-500"
            onSelect={handleDeleteClick}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Edit Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 shadow-lg">
            <div className="bg-[#242424] rounded-lg shadow-lg p-6 w-96">
              <Dialog.Title className="text-lg font-bold mb-2">
                Edit Bookmark
              </Dialog.Title>

              <div className="flex flex-col space-y-2">
                <label className="text-sm">URL</label>
                <input
                  type="text"
                  placeholder="Enter URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full p-3 rounded mb-4 bg-[#353536] hover:bg-[#2e2e2e] outline-none"
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
                  <Select.Content className="bg-[#2E2E2E] shadow-md rounded">
                    {folders.map((folder) => (
                      <Select.Item
                        key={folder.id}
                        value={folder.id}
                        className="p-2 hover:bg-[#353536]"
                      >
                        {folder.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

                <div className="flex justify-end">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default LinkPreviewBasic;
