"use client";

import { GetProduct, SearchProduct } from "@/app/api/product";
import {
  GetProductResponse,
  ProductSearchResponse,
} from "@/app/api/product/product.type";
import { Input, Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState, KeyboardEvent } from "react";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import RenderIf from "../ui/RenderIf";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CollectionRoute } from "@/util/constaint/route";
import { IoShirtOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const HeaderSearch = () => {
  const [result, setResult] = useState<ProductSearchResponse>({
    products: [],
    categories: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      }, 300);
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
    }, 300);
  }, []);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?q=${inputValue}`);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Input
        placeholder="Nhập sản phẩm bạn cần tìm"
        radius="full"
        endContent={<FaSearch />}
        className="w-[30vw]"
        onValueChange={handleValueChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <div
        ref={dropdownRef}
        className={cn(
          "absolute top-12 min-w-10 w-full p-2 max-h-[300px] overflow-y-auto hidden",
          "border-1 border-zinc-300 rounded-lg bg-white",
          {
            block: isOpen,
          }
        )}
      >
        <RenderIf condition={isLoading}>
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        </RenderIf>
        <RenderIf
          condition={
            result.products.length === 0 &&
            result.categories.length === 0 &&
            !isLoading
          }
        >
          <div className="flex items-center justify-center">
            Không có kết quả
          </div>
        </RenderIf>
        <RenderIf
          condition={
            (result.products.length > 0 || result.categories.length > 0) &&
            !isLoading
          }
        >
          <div className="flex flex-col gap-2">
            {result.categories.map((category) => (
              <Link
                href={`${CollectionRoute}/${category.collection.slug}?category=${category.slug}`}
                key={category.id}
              >
                <div className="py-1 flex items-center gap-4">
                  <FaExternalLinkAlt />
                  <div className="flex flex-col">
                    <span className="uppercase text-sm">{category.title}</span>
                    <span className="text-xs text-zinc-400 uppercase">
                      {category.collection.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {result.products.map((product) => (
              <Link href={`products/${product.id}`} key={product.id}>
                <div className="py-1 flex items-center gap-4">
                  <IoShirtOutline />
                  <div className="flex flex-col">
                    <span className="uppercase text-sm">{product.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </RenderIf>
      </div>
    </div>
  );
};
export default HeaderSearch;
