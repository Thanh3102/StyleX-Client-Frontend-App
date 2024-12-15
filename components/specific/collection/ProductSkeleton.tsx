import { Skeleton } from "@nextui-org/react";

const ProductSkeleton = () => {
  return (
    <div className="flex flex-wrap  gap-y-6">
      <div className="px-3 w-1/4">
        <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      </div>
      <div className="px-3 w-1/4">
        <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      </div>
      <div className="px-3 w-1/4">
        <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      </div>
      <div className="px-3 w-1/4">
        <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      </div>
    </div>
  );
};
export default ProductSkeleton;
