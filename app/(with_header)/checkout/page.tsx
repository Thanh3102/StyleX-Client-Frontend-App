import { GetOrderData } from "@/app/api/order";
import CheckoutItemInfo from "@/components/specific/checkout/CheckoutItemInfo";
import FormCheckout from "@/components/specific/checkout/FormCheckout";
import { Suspense } from "react";


const Page = async () => {
  return (
    <div className="flex h-full">
      <div className="flex-[3] py-10 px-20">
        <Suspense>
          <FormCheckout />
        </Suspense>
      </div>
      <div className="flex-[2] py-10 px-20 bg-zinc-100">
        <Suspense>
          <CheckoutItemInfo />
        </Suspense>
      </div>
    </div>
  );
};
export default Page;
