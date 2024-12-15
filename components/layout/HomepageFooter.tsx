"use client";
import { cn } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaRegUser, FaX } from "react-icons/fa6";
import { GoHomeFill, GoSearch } from "react-icons/go";
import HomepageSearch from "./HomepageSearch";
import { GetCollectionResponse } from "@/app/api/collection/collection.type";

type Props = {
  collections: GetCollectionResponse;
};

const HomepageFooter = ({ collections }: Props) => {
  const [openSearch, setOpenSearch] = useState(false);
  return (
    <>
      <div
        className={cn(
          "flex justify-center items-center gap-4",
          "absolute bottom-0 py-5 z-20",
          "w-full bg-transparent "
        )}
      >
        <div className="flex items-center justify-center gap-32">
          <div className="bg-white rounded-full p-3 hover:cursor-pointer">
            <GoHomeFill size={28} />
          </div>
          <div
            className="bg-white rounded-full p-6 hover:cursor-pointer"
            onClick={() => setOpenSearch(true)}
          >
            <GoSearch size={32} />
          </div>
          <Link href={"/profile"}>
            <div className="bg-white rounded-full p-3 hover:cursor-pointer">
              <FaRegUser size={28} />
            </div>
          </Link>
        </div>
      </div>

      <div
        className={cn("absolute z-[60] top-0 h-full w-full hidden", {
          block: openSearch,
        })}
      >
        <HomepageSearch
          collections={collections}
          setOpenSearch={setOpenSearch}
        />
      </div>
    </>
  );
};
export default HomepageFooter;
