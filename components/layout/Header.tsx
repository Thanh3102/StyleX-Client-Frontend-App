"use client";
import { cn } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { BsCart3 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import HeaderSearch from "./HeaderSearch";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import HeaderUser from "../ui/HeaderUser";

const Header = () => {
  const router = useRouter();
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-4",
        "sticky top-0 py-4 px-20 z-40",
        "w-full bg-white border-b-1"
      )}
    >
      <div className="flex justify-between items-center w-[1200px] my-0 mx-auto">
        <div className="bg-white rounded-full">
          <Link href={"/"}>
            <Image
              width={40}
              height={40}
              alt=""
              src={
                "/images/stylex-high-resolution-logo-grayscale-transparent.png"
              }
            />
          </Link>
        </div>

        <HeaderSearch />

        <div className="flex gap-10 items-center text-black [&>*]:hover:cursor-pointer">
          <HeaderUser />

          <Link href={"/cart"}>
            <BsCart3 size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Header;
