"use client";
import { Button, cn } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import { BsCart3 } from "react-icons/bs";
import { Collection } from "@/app/api/collection/collection.type";
import { CollectionRoute } from "@/util/constaint/route";

type Props = {
  collections: Collection[];
};
const HomepageHeader = ({ collections }: Props) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-4",
        "absolute top-0 py-4 px-20 z-20",
        "w-full bg-[rgba(0,0,0,0.1)]"
      )}
    >
      <div className="flex justify-between items-center w-[1200px] my-0 mx-auto">
        <div className="bg-white rounded-full">
          <Link href={"/"}>
            <Image
              width={50}
              height={50}
              alt=""
              src={
                "/images/stylex-high-resolution-logo-grayscale-transparent.png"
              }
            />
          </Link>
        </div>

        <div
          className={cn(
            "flex items-center gap-20 text-xl text-white ",
            "[&>*]:hover:cursor-pointer"
          )}
        >
          {collections.map((collection) => (
            <Link
              href={`${CollectionRoute}/${collection.slug}`}
              key={collection.id}
            >
              <span className="hover:underline" key={collection.id}>
                {collection.title}
              </span>
            </Link>
          ))}
        </div>

        <Link href={"/cart"}>
          <div className="flex gap-4 items-center text-white [&>*]:hover:cursor-pointer">
            <BsCart3 size={24} />
          </div>
        </Link>
      </div>
    </div>
  );
};
export default HomepageHeader;
