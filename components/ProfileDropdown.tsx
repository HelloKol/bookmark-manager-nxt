import * as React from "react";
import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import { logout } from "@/lib/auth";
import EditProfileModal from "./EditProfileModal";
import { useAppContext } from "@/context/AppProvider";
import DropdownMenu from "@/components/RadixUI/DropdownMenu";

const ProfileDropdown = () => {
  const { user } = useAppContext();

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
      <DropdownMenuRadix.Item className="cursor-pointer p-3 rounded-md hover:bg-[#2E2E2E] text-red-500 outline-none">
        <button type="button" onClick={logout} className="cursor-pointer">
          Logout
        </button>
      </DropdownMenuRadix.Item>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
