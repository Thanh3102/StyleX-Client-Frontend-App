"use client";
import { updateSearchParams } from "@/util/helper";
import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateParams = (value: string) => {
    const url = updateSearchParams(
      new URLSearchParams(Array.from(searchParams.entries())),
      [{ name: "q", value: value }],
      pathname
    );
    router.push(url);
  };

  const handleChange = (value: string) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateParams(value);
    }, 300);
  };

  return (
    <div className="p-5">
      <Input
        label="Tìm kiếm"
        variant="bordered"
        placeholder="Nhập từ khóa tìm kiếm"
        radius="full"
        labelPlacement="outside"
        defaultValue={searchParams.get("q") ?? undefined}
        onValueChange={handleChange}
      />
    </div>
  );
};
export default SearchInput;
