import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { logout } from "@/lib/auth";

const ProfileDropdown = ({}: {}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="w-14 rounded-full overflow-hidden select-none cursor-pointer">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] rounded-md bg-[#242424] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item className="group w-full relative flex select-none items-center rounded-[3px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
            <button
              type="button"
              onClick={logout}
              className="text-white bg-gray-800 w-full hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Logout
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ProfileDropdown;
