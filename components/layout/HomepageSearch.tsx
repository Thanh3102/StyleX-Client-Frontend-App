"use client";

import Link from "next/link";
import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaExternalLinkAlt, FaHome, FaSearch } from "react-icons/fa";
import { FaRegUser, FaX } from "react-icons/fa6";
import Image from "next/image";
import { GetCollectionResponse } from "@/app/api/collection/collection.type";
import { cn, Input } from "@nextui-org/react";
import { CollectionRoute } from "@/util/constaint/route";
import { BsCart3 } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { IoShirtOutline } from "react-icons/io5";
import {
  ASSET_ALL_PRODUCT_ICON_IMAGE,
  ASSET_IMAGE_NOT_FOUND,
} from "@/util/constaint/asset-url";
import RenderIf from "../ui/RenderIf";
import {
  GetProductResponse,
  ProductSearchResponse,
} from "@/app/api/product/product.type";
import { SearchProduct } from "@/app/api/product";
import { useRouter } from "next/navigation";

type Props = {
  collections: GetCollectionResponse;
  setOpenSearch: Dispatch<SetStateAction<boolean>>;
};

const HomepageSearch = ({ collections, setOpenSearch }: Props) => {
  const [selectedCollection, setSelectedCollection] = useState<
    GetCollectionResponse[0]
  >(collections[0]);

  const [inputValue, setInputValue] = useState<string>();

  const [openSearchResult, setOpenSearchResult] = useState(false);
  const [result, setResult] = useState<ProductSearchResponse>({
    products: [],
    categories: [],
  });

  const router = useRouter();
  const searchResultRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback((query: string) => {
    try {
      clearTimeout(timeoutRef.current);
      if (!query) {
        setResult({
          products: [],
          categories: [],
        });
        return;
      }
      timeoutRef.current = setTimeout(async () => {
        const response = await SearchProduct(query);
        setResult(response);
      }, 1000);
    } catch (error) {
      setResult({
        products: [],
        categories: [],
      });
    }
  }, []);

  const handleValueChange = useCallback((value: string) => {
    setInputValue(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      fetchData(value);
    }, 1000);
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (
      searchResultRef.current &&
      !searchResultRef.current.contains(event.target)
    ) {
      setOpenSearchResult(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?q=${inputValue}`);
    }
  };

  return (
    <div className=" bg-white h-full relative">
      {/* Header Section */}
      <RenderIf condition={!openSearchResult}>
        <div
          className={cn(
            "flex justify-between items-center gap-4",
            "absolute top-0 py-4 px-20 z-20",
            "w-full"
          )}
        >
          <div className="flex justify-between items-center w-[1200px] my-0 mx-auto text-black">
            <div className="bg-white rounded-full ">
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
                "flex items-center gap-20 text-xl",
                "[&>*]:hover:cursor-pointer"
              )}
            >
              {collections.map((collection) => (
                <div
                  className={cn("hover:text-blue-500 py-2 ", {
                    "text-blue-500 border-b-2 border-blue-500":
                      selectedCollection.id === collection.id,
                  })}
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection)}
                >
                  {collection.title}
                </div>
              ))}
            </div>

            <Link href={"/cart"}>
              <div className="flex gap-4 items-center [&>*]:hover:cursor-pointer">
                <BsCart3 size={24} />
              </div>
            </Link>
          </div>
        </div>
      </RenderIf>

      {/* Category Section */}
      <RenderIf condition={!openSearchResult}>
        <div className="pt-20 w-[1000px] mx-auto">
          <div className="flex gap-y-4 -mx-2 [&>*]:px-2 flex-wrap">
            <div className="w-3/12 hover:cursor-pointer">
              <div className="p-4 flex gap-2 items-center">
                <div className="w-10 flex aspect-square">
                  <img
                    alt=""
                    src={ASSET_ALL_PRODUCT_ICON_IMAGE}
                    className="object-fill max-w-full max-h-full"
                  />
                </div>
                <Link href={`${CollectionRoute}/${selectedCollection.slug}`}>
                  <span className="uppercase">Tất cả</span>
                </Link>
              </div>
            </div>
            {selectedCollection.categories.map((category) => (
              <div className="w-3/12 hover:cursor-pointer" key={category.id}>
                <Link
                  href={`${CollectionRoute}/${selectedCollection.slug}?category=${category.slug}`}
                  className="p-4 flex gap-2 items-center"
                >
                  <div className="w-10 flex aspect-square">
                    <img
                      alt=""
                      src={category.image ?? ASSET_IMAGE_NOT_FOUND}
                      className="object-fill max-w-full max-h-full"
                    />
                  </div>
                  <span className="uppercase">{category.title}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </RenderIf>

      {/* Search Result Section */}
      <RenderIf condition={openSearchResult}>
        <div className="w-[1200px] mx-auto h-full" ref={searchResultRef}>
          <div className="pb-40 h-full">
            <div className="h-full overflow-y-auto p-5">
              <div className="flex flex-col gap-2">
                {result.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`${CollectionRoute}/${category.collection.slug}?category=${category.slug}`}
                  >
                    <div className="py-2 flex items-center gap-4">
                      <FaExternalLinkAlt />
                      <div className="flex flex-col">
                        <span className=" uppercase">{category.title}</span>
                        <span className="text-sm text-zinc-400 uppercase">
                          {category.collection.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {result.products.map((product) => (
                  <Link href={`products/${product.id}`} key={product.id}>
                    <div className="py-2 flex items-center gap-4">
                      <IoShirtOutline />
                      <div className="flex flex-col">
                        <span className=" uppercase">{product.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RenderIf>

      {/* Footer Section */}
      <div className="absolute bottom-5 w-full">
        <div className="py-5 w-[1200px] mx-auto">
          <Input
            radius="full"
            variant="bordered"
            placeholder="Tìm kiếm theo từ khóa"
            startContent={<FaSearch />}
            onFocus={() => setOpenSearchResult(true)}
            onValueChange={handleValueChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-center justify-center gap-32">
          <div className="bg-white rounded-full p-3 hover:cursor-pointer shadow-small">
            <GoHome size={28} onClick={() => setOpenSearch(false)} />
          </div>
          <div
            className="bg-black text-white rounded-full p-6 hover:cursor-pointer"
            onClick={() => setOpenSearch(false)}
          >
            <FaX size={28} />
          </div>
          <Link href={"/profile"}>
            <div className="bg-white rounded-full p-3 hover:cursor-pointer shadow-small">
              <FaRegUser size={28} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default HomepageSearch;
