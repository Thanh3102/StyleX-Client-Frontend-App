"use client";

import { OrderStatus } from "@/app/api/customer/customer.type";
import { Select, SelectItem } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OrderStatusFilter = () => {
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelectionChange = (key: string) => {
    if (!key) {
      console.log("delete");

      const newSearch = new URLSearchParams(search.toString());
      newSearch.delete("status");
      router.replace(`${pathname}?${newSearch.toString()}`);
    }
    const newSearch = new URLSearchParams(search.toString());
    newSearch.set("status", key);
    router.replace(`${pathname}?${newSearch.toString()}`);
  };
  return (
    <div className="w-[200px]">
      <Select
        label="Trạng thái"
        disallowEmptySelection
        defaultSelectedKeys={[search.get("status") ?? ""]}
        onSelectionChange={(key) =>
          handleSelectionChange(Array.from(key)[0] as string)
        }
      >
        <SelectItem key={""}>Tất cả</SelectItem>
        <SelectItem key={OrderStatus.COMPLETE}>Đã hoàn thành</SelectItem>
        <SelectItem key={OrderStatus.IN_TRANSIT}>Đang vận chuyển</SelectItem>
        <SelectItem key={OrderStatus.PENDING_PROCESSING}>Đang xử lý</SelectItem>
      </Select>
    </div>
  );
};
export default OrderStatusFilter;
