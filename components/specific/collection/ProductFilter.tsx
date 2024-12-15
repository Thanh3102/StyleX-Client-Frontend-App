"use client";
import { Category } from "@/app/api/collection/collection.type";
import { clearParams, updateSearchParams } from "@/util/helper";
import {
  Accordion,
  AccordionItem,
  Button,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdOutlineFilterAltOff } from "react-icons/md";

type Props = {
  categories: Omit<Category, "id">[];
};
const ProductFilter = ({ categories }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();
  const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });

  const [selectedCategory, SetSelectedCategory] = useState<string | null>(
    search.get("category")
  );

  const handleSearchParamChange = (name: string, value: string) => {
    const url = updateSearchParams(
      new URLSearchParams(Array.from(search.entries())),
      [
        {
          name: name,
          value: value,
        },
      ],
      pathname
    );

    router.push(url);
  };

  const handleClearFilter = () => {
    router.push(pathname);
  };

  const handleCategoryChange = (value: string) => {
    if (selectedCategory === value) {
      router.push(
        clearParams(
          new URLSearchParams(Array.from(search.entries())),
          "category",
          pathname
        )
      );
    } else {
      handleSearchParamChange("category", value);
      SetSelectedCategory(value);
    }
  };

  return (
    <div className="sticky top-20 h-[90vh] overflow-y-auto px-5 pb-5 border-r-1">
      <div className="flex items-center justify-center">
        <Button
          fullWidth
          startContent={<MdOutlineFilterAltOff />}
          variant="light"
          onClick={handleClearFilter}
        >
          Xóa bộ lọc
        </Button>
      </div>
      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["category", "price"]}
        itemClasses={{
          title: "text-sm text-gray-500",
        }}
      >
        <AccordionItem title="Danh mục" key={"category"}>
          <RadioGroup
            onValueChange={handleCategoryChange}
            size="sm"
            value={search.get("category")}
          >
            {categories.map((category) => (
              <Radio value={category.slug} key={category.slug}>
                {category.title}
              </Radio>
            ))}
          </RadioGroup>
        </AccordionItem>
        <AccordionItem title="Giá" key={"price"}>
          <RadioGroup
            onValueChange={(value) =>
              handleSearchParamChange("priceRange", value)
            }
            size="sm"
            value={search.get("priceRange")}
          >
            <Radio value={"0-100000"}>Dưới {currency.format(1e5)}</Radio>
            <Radio value={"100000-500000"}>
              Từ {currency.format(1e5)} - {currency.format(5e5)}
            </Radio>
            <Radio value={"500000-1000000"}>
              Từ {currency.format(5e5)} - {currency.format(1e6)}
            </Radio>
            <Radio value={"1000000-5000000"}>
              Từ {currency.format(1e6)} - {currency.format(5e6)}
            </Radio>
            <Radio value={"5000000"}>Từ {currency.format(5e6)} trở lên</Radio>
          </RadioGroup>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default ProductFilter;
