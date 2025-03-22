import * as React from "react";
import { logout } from "@/lib/auth";
import EditProfileModal from "./EditProfileModal";
import { useAppContext } from "@/context/AppProvider";
import { toast } from "react-toastify";
import {
  DropdownMenuRoot,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

const ProfileDropdown = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const handleLogout = async () => {
    const logoutPromise = new Promise<void>(async (resolve, reject) => {
      try {
        await logout();
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(logoutPromise, {
      pending: "Logging out...",
      success: {
        render() {
          router.push("/login");
          return "Logout successful!";
        },
      },
      error: {
        render({ data }) {
          console.error("Logout error:", data);
          return "Logout failed. Please try again.";
        },
      },
    });
  };

  return (
    <>
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <div className="w-14 h-14 rounded-full overflow-hidden select-none cursor-pointer">
            <Image
              width={150}
              height={150}
              src={user?.profileImageUrl || "https://placehold.co/600x400"}
              alt={""}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsFolderModalOpen(true)}>
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500">
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>

      <EditProfileModal
        isDialogOpen={isFolderModalOpen}
        setDialogOpen={setIsFolderModalOpen}
      />
    </>
  );
};

export default ProfileDropdown;
