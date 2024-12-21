"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { FaRegUser } from "react-icons/fa6";
import LoginModal from "./LoginModal";
import { usePathname } from "next/navigation";

const HeaderUser = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  if (session && !session.terminate) {
    return (
      <Dropdown showArrow>
        <DropdownTrigger>
          <div className="">
            <FaRegUser size={24} />
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem href="/profile">Thông tin cá nhân</DropdownItem>
          <DropdownItem href="/history">Lịch sử mua hàng</DropdownItem>
          <DropdownItem className="text-red-500" onClick={() => signOut()}>
            Đăng xuất
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <>
      <FaRegUser size={24} onClick={onOpen} />
      <LoginModal
        redirect={pathname}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
export default HeaderUser;
