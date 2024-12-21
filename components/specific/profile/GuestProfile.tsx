"use client";

import LoginModal from "@/components/ui/LoginModal";
import { useDisclosure } from "@nextui-org/react";

const GuestProfile = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  return (
    <>
      <div className="flex gap-2 px-20 py-10">
        <span>Bạn cần đăng nhập để xem sử dụng chức năng này</span>
        <span
          className="font-semibold hover:cursor-pointer"
          onClick={() => onOpen()}
        >
          Đăng nhập
        </span>
      </div>
      <LoginModal
        redirect="/profile"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};
export default GuestProfile;
