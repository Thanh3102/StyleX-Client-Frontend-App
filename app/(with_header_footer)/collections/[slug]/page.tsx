import { getCollectionDetail, GetCollections } from "@/app/api/collection";
import ProductFilter from "@/components/specific/collection/ProductFilter";
import ProductList from "@/components/specific/collection/ProductList";
import CustomBreadcrumbs, {
  BreadcrumItemType,
} from "@/components/ui/CustomBreadcrumbs";
import LoadingPage from "@/components/ui/LoadingPage";
import { cn } from "@nextui-org/react";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  params: { slug: string };
};

const Page = async ({ params: { slug } }: Props) => {
  const collections = await GetCollections();
  const collection = await getCollectionDetail(slug);
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
      title: `${collection?.title}`,
      href: "/",
      isCurrent: true,
    },
  ];

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        <ProductFilter categories={collection?.categories ?? []} />
      </div>
      <div className="flex-[4] flex flex-col">
        <div className="pt-5 px-5">
          <CustomBreadcrumbs items={breadcrumbItems} />
        </div>
        <div className="flex gap-4 overflow-y-auto p-4 items-center">
          <span className="font-semibold">Bộ sản phẩm</span>
          {collections.map((collection) => (
            <Link href={`/collections/${collection.slug}`} key={collection.id}>
              <div
                className={cn(
                  "py-1 px-2 rounded-md  min-w-20 text-center",
                  "border-1 hover:border-blue-500 hover:cursor-pointer hover:text-blue-500",
                  {
                    "text-blue-500 border-blue-500": collection.slug === slug,
                  }
                )}
              >
                {collection.title}
              </div>
            </Link>
          ))}
        </div>
        {/* <ActiveFilter/> */}
        <Suspense fallback={<LoadingPage />}>
          <ProductList slug={slug} />
        </Suspense>
      </div>
    </div>
  );
};
export default Page;
