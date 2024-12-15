import { GetProductDetail } from "@/app/api/product";
import ProductDescription from "@/components/specific/product/ProductDescription";
import ProductDetail from "@/components/specific/product/ProductDetail";
import ProductWithSameCategory from "@/components/specific/product/ProductWithSameCategory";
import { isInteger } from "@/util/helper/StringHelper";
import { redirect } from "next/navigation";


type Props = {
  params: { id: string };
  searchParams: { v: string };
};

const Page = async ({ params: { id }, searchParams: { v } }: Props) => {
  if (!isInteger(id)) redirect("/");

  const productDetail = await GetProductDetail(parseInt(id));

  return (
    <div className="px-20 py-10">

      <ProductDetail
        product={productDetail}
        variantId={!isNaN(parseInt(v)) ? parseInt(v) : undefined}
      />
      <ProductWithSameCategory products={productDetail.sameCategoryProducts} />
    </div>
  );
};
export default Page;
