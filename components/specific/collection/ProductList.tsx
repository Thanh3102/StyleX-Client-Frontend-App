"use client";
import { GetProduct } from "@/app/api/product";
import { BasicProduct } from "@/app/api/product/product.type";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import RenderIf from "@/components/ui/RenderIf";
import ProductSkeleton from "./ProductSkeleton";
import { isInteger } from "@/util/helper/StringHelper";

type Props = {
  slug?: string;
};

const ProductList = ({ slug }: Props) => {
  const [products, setProducts] = useState<BasicProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const params = useSearchParams();
  // const pathname = usePathname();
  // const router = useRouter();

  const limit = 20;

  const displayProducts = useMemo(() => {
    let displayProducts: BasicProduct[] = products;
    const priceRange = params.get("priceRange");
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      const maxValue = isInteger(max) ? parseInt(max) : 1e12;
      const minValue = isInteger(min) ? parseInt(min) : 0;
      displayProducts = products.filter((product) => {
        const price = product.variants[0].discountPrice
          ? product.variants[0].discountPrice
          : product.variants[0].sellPrice;
        if (price >= minValue && price <= maxValue) {
          return true;
        }
        return false;
      });
    }

    switch (sortBy) {
      case "":
        return displayProducts;
      case "new":
        return displayProducts.sort((a, b) => {
          const dateB = new Date(b.createdAt);
          const dateA = new Date(a.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      case "name-asc":
        return displayProducts.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      case "name-desc":
        return displayProducts.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA > nameB) {
            return -1;
          } else if (nameA < nameB) {
            return 1;
          }
          return 0;
        });
      case "price-asc":
        return displayProducts.sort((a, b) => {
          const priceA = a.variants[0].discountPrice
            ? a.variants[0].discountPrice
            : a.variants[0].sellPrice;
          const priceB = b.variants[0].discountPrice
            ? b.variants[0].discountPrice
            : b.variants[0].sellPrice;
          if (priceA < priceB) {
            return -1;
          } else if (priceA > priceB) {
            return 1;
          }
          return 0;
        });
      case "price-desc":
        return displayProducts.sort((a, b) => {
          const priceA = a.variants[0].discountPrice
            ? a.variants[0].discountPrice
            : a.variants[0].sellPrice;
          const priceB = b.variants[0].discountPrice
            ? b.variants[0].discountPrice
            : b.variants[0].sellPrice;
          if (priceA > priceB) {
            return -1;
          } else if (priceA < priceB) {
            return 1;
          }
          return 0;
        });
    }
  }, [products, params]);

  useEffect(() => {
    getProducts(page);
  }, []);

  useEffect(() => {
    getProducts(1);
  }, [params]);

  useEffect(() => {
    getProducts(1);
  }, [sortBy]);

  const getProducts = async (page: number, options?: { push?: boolean }) => {
    try {
      if (options?.push) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      const response = await GetProduct({
        page: page.toString(),
        limit: limit.toString(),
        slug: slug ?? "",
        query: params.get("q") ?? "",
        category: params.get("category") ?? "",
        priceRange: params.get("priceRange") ?? "",
        sort: sortBy,
      });
      setIsLoading(false);
      setIsLoadingMore(false);
      if (options?.push) {
        setProducts((products) => [...products, ...response.data]);
      } else {
        setProducts(response.data);
      }
      setPage(response.currentPage);
      setHasMore(response.currentPage < response.lastPage);
      setTotal(response.total);
    } catch (error) {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    getProducts(page + 1, { push: true });
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <span className="font-medium text-lg">{total} kết quả</span>
        <Select
          disallowEmptySelection
          selectedKeys={[sortBy]}
          selectionMode="single"
          label="Sắp xếp theo"
          labelPlacement="outside-left"
          radius="full"
          className="max-w-[300px]"
          classNames={{ label: "text-nowrap", base: "items-center" }}
          onSelectionChange={(key) => setSortBy(key.anchorKey as string)}
        >
          <SelectItem key={""}>Mặc định</SelectItem>
          <SelectItem key={"new"}>Mới nhất</SelectItem>
          <SelectItem key={"price-asc"}>Giá tăng dần</SelectItem>
          <SelectItem key={"price-desc"}>Giá giảm dần</SelectItem>
          <SelectItem key={"name-asc"}>Tên A - Z</SelectItem>
          <SelectItem key={"name-desc"}>Tên Z - A</SelectItem>
        </Select>
      </div>

      <RenderIf condition={!isLoading}>
        <div className="p-5 border-b-1 border-gray-300">
          <RenderIf condition={products.length === 0}>
            <div className="">Không có sản phẩm</div>
          </RenderIf>
          <RenderIf
            condition={displayProducts?.length === 0 && products.length > 0}
          >
            <div className="">Không có sản phẩm theo bộ lọc</div>
          </RenderIf>
          <RenderIf condition={products.length > 0}>
            <div className="flex flex-wrap -mx-3 gap-y-6">
              {displayProducts &&
                displayProducts.map((product) => (
                  <div className="px-3 w-1/4" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </RenderIf>
        </div>
        <RenderIf condition={hasMore && products.length > 0}>
          <div className="flex flex-col gap-4 items-center justify-center my-5">
            <Button
              onClick={handleLoadMore}
              radius="full"
              size="lg"
              className="text-lg font-semibold text-white bg-black"
              isLoading={isLoadingMore}
              isDisabled={isLoadingMore}
            >
              Xem thêm
            </Button>

            <span className="text-sm text-gray-500">
              Hiển thị 1 - {page * limit <= total ? page * limit : total} trên
              tổng số {total} sản phẩm
            </span>
          </div>
        </RenderIf>
      </RenderIf>

      <RenderIf condition={isLoading}>
        <ProductSkeleton />
      </RenderIf>
    </>
  );
};
export default ProductList;