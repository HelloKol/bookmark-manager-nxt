import * as React from "react";
import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import { logout } from "@/lib/auth";
import EditProfileModal from "./EditProfileModal";
import { useAppContext } from "@/context/AppProvider";
import DropdownMenu from "@/components/RadixUI/DropdownMenu";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
  const router = useRouter();
  const { user } = useAppContext();

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
    <DropdownMenu
      trigger={
        <div className="w-14 h-14 rounded-full overflow-hidden select-none cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user?.profileImageUrl || "https://placehold.co/600x400"}
            alt={""}
          />
        </div>
      }
    >
      <EditProfileModal />
      <DropdownMenuRadix.Item
        className="cursor-pointer p-3 rounded-md hover:bg-[#2E2E2E] text-red-500 outline-none"
        onClick={handleLogout}
      >
        <button type="button" className="cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </DropdownMenuRadix.Item>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
