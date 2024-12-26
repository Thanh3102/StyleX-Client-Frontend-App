"use client";

import { ApplyVoucher, GetOrderData } from "@/app/api/order";
import { OrderData } from "@/app/api/order/order.type";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RiCouponLine } from "react-icons/ri";
import Image from "next/image";
import { ASSET_IMAGE_NOT_FOUND } from "@/util/constaint/asset-url";
import RenderIf from "@/components/ui/RenderIf";

const CheckoutItemInfo = () => {
  const searchParam = useSearchParams();
  const currencyFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });
  const [order, setOrder] = useState<OrderData>();
  const [isLoading, setIsLoading] = useState(false);
  const [countDown, setCountdown] = useState(20 * 60);

  const voucherInputRef = useRef<HTMLInputElement>(null);

  const handleApplyVoucher = async () => {
    const voucherCode = voucherInputRef.current?.value;
    if (!order) return;
    if (!voucherCode) {
      toast.error("Vui lòng nhập mã khuyến mại");
      return;
    }
    try {
      const { message } = await ApplyVoucher({
        orderId: order.id,
        voucherCode: voucherCode,
      });
      toast.success(message);
      fetchOrderData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const renderCountDown = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60); //
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const fetchOrderData = async () => {
    try {
      setIsLoading(true);
      const data = await GetOrderData(searchParam.get("order") ?? "");
      setIsLoading(false);
      setOrder(data);
      setCountdown(() => {
        const timeLeft = Math.round(
          (data.expire - new Date().getTime()) / 1000
        );
        return timeLeft > 0 ? timeLeft : 0;
      });
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    if (countDown === 0) return;

    const interval = setInterval(() => {
      setCountdown((countDown) => countDown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (!order) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">Thông tin hóa đơn</span>
        <span>Giao dịch hết hạn sau {renderCountDown(countDown)}</span>
      </div>
      <div className="max-h-[350px] overflow-y-auto flex gap-4 flex-col bg-white p-4 rounded-lg">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <Image
              width={100}
              height={150}
              src={item.product.image ?? ASSET_IMAGE_NOT_FOUND}
              alt=""
              className="object-cover bg-white rounded-md border-1 border-zinc-400"
            />
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {item.product.name}
                </span>
                <RenderIf condition={item.variant.title !== "Default Title"}>
                  <span className="text-xs text-zinc-500">
                    {item.variant.title}
                  </span>
                </RenderIf>
                <div className="flex gap-2 text-sm font-medium">
                  <RenderIf
                    condition={
                      item.priceBeforeDiscount !== item.priceAfterDiscount
                    }
                  >
                    <span className="text-zinc-400 line-through">
                      {currencyFormat.format(item.priceBeforeDiscount)}
                    </span>
                  </RenderIf>
                  <span>{currencyFormat.format(item.priceAfterDiscount)}</span>
                </div>
                <span className="text-xs text-zinc-500">{`x${item.quantity}`}</span>
              </div>
              <div className="flex gap-2">
                <RenderIf
                  condition={
                    item.totalPriceBeforeDiscount !==
                    item.totalPriceAfterDiscount
                  }
                >
                  <span className="text-sm font-semibold text-zinc-500 line-through">
                    {currencyFormat.format(item.totalPriceBeforeDiscount)}
                  </span>
                </RenderIf>
                <span className="text-sm font-semibold">
                  {currencyFormat.format(item.totalPriceAfterDiscount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Input
        ref={voucherInputRef}
        placeholder="Nhập mã giảm giá"
        variant="bordered"
        radius="sm"
        startContent={
          <div className="mx-2">
            <RiCouponLine size={20} />
          </div>
        }
        color="success"
        endContent={
          <Button
            variant="light"
            size="sm"
            color="success"
            onClick={handleApplyVoucher}
          >
            Xác nhận
          </Button>
        }
        className="bg-white"
      />

      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="flex-1 text-zinc-500">Tổng sản phẩm</div>
          <div className="flex-1 text-end font-semibold">
            {currencyFormat.format(order.totalItemBeforeDiscount)}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex-1 text-zinc-500">Giảm giá</div>
          <div className="flex-1 text-end font-semibold">
            {currencyFormat.format(
              order.totalItemDiscountAmount + order.totalOrderDiscountAmount
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex-1 font-bold">Tổng tiền</div>
          <div className="flex-1 text-end font-semibold text-lg">
            {currencyFormat.format(order.totalOrderAfterDiscount)}
          </div>
        </div>
      </div>

      <Button
        color="primary"
        radius="sm"
        size="lg"
        type="submit"
        form="FormCheckout"
      >
        Thanh toán
      </Button>
    </div>
  );
};
export default CheckoutItemInfo;
