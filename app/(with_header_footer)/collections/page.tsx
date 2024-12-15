import { getCollectionDetail, GetCollections } from "@/app/api/collection";
import { GetCollectionResponse } from "@/app/api/collection/collection.type";
import ProductFilter from "@/components/specific/collection/ProductFilter";
import ProductList from "@/components/specific/collection/ProductList";
import CustomBreadcrumbs, {
  BreadcrumItemType,
} from "@/components/ui/CustomBreadcrumbs";
import LoadingPage from "@/components/ui/LoadingPage";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
      title: `Tất cả sản phẩm`,
      href: "/collection",
      isCurrent: true,
    },
  ];

  return (
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
        <div className="flex gap-4 overflow-y-auto p-4 items-center">
          <span className="font-semibold">Bộ sản phẩm</span>
          {collections.map((collection) => (
            <Link href={`collections/${collection.slug}`} key={collection.id}>
              <div
                className={cn(
                  "py-1 px-2 rounded-md  min-w-20 text-center",
                  "border-1 hover:border-blue-500 hover:cursor-pointer hover:text-blue-500"
                )}
              >
                {collection.title}
              </div>
            </Link>
          ))}
        </div>
        <Suspense fallback={<LoadingPage />}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
};
export default Page;
