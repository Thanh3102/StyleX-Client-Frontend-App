import { GetCollections } from "@/app/api/collection";
import { GetCollectionResponse } from "@/app/api/collection/collection.type";
import ProductFilter from "@/components/specific/collection/ProductFilter";
import ProductList from "@/components/specific/collection/ProductList";
import SearchInput from "@/components/specific/search/SearchInput";
import CustomBreadcrumbs, {
  BreadcrumItemType,
} from "@/components/ui/CustomBreadcrumbs";
import LoadingPage from "@/components/ui/LoadingPage";
import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";
import { Suspense } from "react";

const Page = async () => {
  const collections = await GetCollections();
  const categories: GetCollectionResponse[0]["categories"] = [];
  collections.forEach((collection) =>
    collection.categories.forEach((category) => {
      if (!categories.find((item) => item.title === category.title)) {
        categories.push(category);
      }
    })
  );

  const breadcrumbItems: BreadcrumItemType[] = [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Tất cả sản phẩm",
      href: "/collections",
    },
    {
      title: `Tìm kiếm`,
      href: "/search",
      isCurrent: true,
    },
  ];

  return (
    <Suspense>
      <div className="flex h-full">
        <div className="flex-1 relative">
          <Suspense>
            <ProductFilter
              categories={categories.sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase())
              )}
            />
          </Suspense>
        </div>
        <div className="flex-[4] flex flex-col">
          <div className="pt-5 px-5">
            <CustomBreadcrumbs items={breadcrumbItems} />
          </div>
          <SearchInput />
          <Suspense fallback={<LoadingPage />}>
            <ProductList />
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
};
export default Page;
