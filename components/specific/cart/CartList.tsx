"use client";
import { CartItem } from "@/app/api/cart/cart.type";
import CartListItem from "./CartListItem";
import {
  Button,
  CheckboxGroup,
  RadioGroup,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { useImmer } from "use-immer";
import { getSession, useSession } from "next-auth/react";
import {
  GetCartItems,
  GetGuestCartItems,
  UpdateCartSelectedItem,
  UpdateGuestCartSelectedItem,
} from "@/app/api/cart";
import { useEffect, useRef, useState } from "react";
import RenderIf from "@/components/ui/RenderIf";
import { BiSolidSelectMultiple } from "react-icons/bi";
import { PiSelectionBold } from "react-icons/pi";
import { FaBasketShopping } from "react-icons/fa6";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify";
import { CreateTempOrder } from "@/app/api/order";
import { Promotion } from "@/app/api/product/product.type";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CartList = () => {
  const router = useRouter();
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });
  const { data: session } = useSession();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [cartItems, setCartItems] = useImmer<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useImmer<string[]>([]);
  const [cartInfo, setCartInfo] = useImmer({
    totalItemBeforeDiscount: 0,
    totalItemAfterDiscount: 0,
    totalItemDiscountAmount: 0,
    totalOrderBeforeDiscount: 0,
    totalOrderAfterDiscount: 0,
    totalOrderDiscountAmount: 0,
  });
  const [orderPromotions, setOrderPromotions] = useState<Promotion[]>([]);

  const selectedChangeTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      if (!session || session.terminate) {
        const cartId = localStorage.getItem("cartId");
        const { data, id, applyOrderPromotions, ...rest } =
          await GetGuestCartItems(cartId ?? "");
        setCartItems(data);
        setOrderPromotions(applyOrderPromotions);
        setCartInfo(rest);

        if (id) {
          localStorage.setItem("cartId", id);
        }
      } else {
        // Load giỏ hàng khách hàng
        const { data, id, applyOrderPromotions, ...rest } = await GetCartItems(
          session.accessToken
        );
        setCartItems(data);
        setOrderPromotions(applyOrderPromotions);
        setCartInfo(rest);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSelectedChange = async (itemIds: string[]) => {
    const numberItemIds = itemIds.map((id) => parseInt(id));
    const cartId = localStorage.getItem("cartId");
    try {
      const session = await getSession();
      if (session?.terminate || !session) {
        await UpdateGuestCartSelectedItem({
          cartId: cartId as string,
          itemIds: numberItemIds,
        });
      } else {
        await UpdateCartSelectedItem({
          itemIds: numberItemIds,
          token: session.accessToken,
        });
      }
      fetchCartItems();
    } catch (error) {
      fetchCartItems();
    }
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      const { id } = await CreateTempOrder(
        {
          type: session && !session.terminate ? "Customer" : "Guest",
          cartItemIds: selectedItems.map((item) => parseInt(item)),
        },
        session?.accessToken
      );
      router.push(`/checkout?order=${id}`);

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);

      toast.error(error.message);
    }
  };

  const renderOrderPromotion = (promotions: Promotion[]) => {
    return (
      <div className="w-[300px] max-h-[200px] overflow-y-auto p-2 rounded-md">
        {promotions.map((promotion) => (
          <div className="flex" key={promotion.id}>
            <div className="flex-[2] flex-col">
              <div className="font-medium text-sm">{promotion.title}</div>
              <div className="text-zinc-400 text-xs">
                {promotion.description}
              </div>
            </div>
            <div className="flex-1 flex justify-end font-semibold">
              {formatter.format(promotion.amount * -1)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    clearTimeout(selectedChangeTimeoutRef.current);
    selectedChangeTimeoutRef.current = setTimeout(() => {
      handleSelectedChange(selectedItems);
    }, 500);
  }, [selectedItems]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 py-5 relative">
        <div className="flex-[3]">
          <div className="flex justify-between">
            <div className="flex gap-2 my-2">
              <Button
                size="sm"
                variant="light"
                startContent={<BiSolidSelectMultiple />}
                color="primary"
                onClick={() =>
                  setSelectedItems(
                    cartItems
                      .filter((item) => item.avaiable > 0)
                      .map((item) => item.id.toString())
                  )
                }
              >
                Chọn tất cả
              </Button>
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<PiSelectionBold />}
                onClick={() => setSelectedItems([])}
              >
                Bỏ chọn tất cả
              </Button>
            </div>
            <RenderIf condition={false}>
              <div className="py-2">
                Đã chọn {selectedItems.length}/{cartItems.length} sản phẩm
              </div>
            </RenderIf>
          </div>
          <div className="shadow-lg rounded-lg border-1 border-zinc-400 relative">
            <div className="flex items-center font-semibold bg-zinc-50 px-5 py-5 sticky top-16 z-20 self-start">
              <div className="w-6/12">Sản phẩm</div>
              <div className="w-2/12">Đơn giá</div>
              <div className="w-2/12 flex justify-center">Số lượng</div>
              <div className="w-2/12 flex justify-end">Thành tiền</div>
            </div>
            <RenderIf condition={cartItems.length === 0 && !isLoading}>
              <div className="h-[60vh] w-full flex items-center justify-center">
                Giỏ hàng chưa có sản phẩm nào
              </div>
            </RenderIf>
            <RenderIf condition={isLoading}>
              <div className="h-full w-full flex items-center justify-center">
                <Spinner />
              </div>
            </RenderIf>
            <RenderIf condition={cartItems.length > 0 && !isLoading}>
              <CheckboxGroup
                value={selectedItems}
                onValueChange={(value) => setSelectedItems(value)}
              >
                {cartItems.map((item) => (
                  <CartListItem
                    item={item}
                    key={item.id}
                    fetchData={fetchCartItems}
                  />
                ))}
              </CheckboxGroup>
            </RenderIf>
          </div>
        </div>
        <div className="flex-1 flex-col sticky top-20 self-start">
          <div className="bg-white p-5 rounded-lg shadow-large flex flex-col h-fit">
            <div
              className={cn("flex items-center justify-between", {
                "justify-start": orderPromotions.length === 0,
              })}
            >
              <span className="text-lg font-semibold my-2">Thanh toán</span>
              <RenderIf condition={orderPromotions.length > 0}>
                <Tooltip
                  showArrow
                  placement="bottom"
                  content={renderOrderPromotion(orderPromotions)}
                >
                  <div className="text-xs px-2 py-1 rounded-md bg-red-500 text-white hover:cursor-default">
                    Khuyến mại
                  </div>
                </Tooltip>
              </RenderIf>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex">
                <div className="w-1/2 font-medium">Tạm tính:</div>
                <div className="w-1/2 text-end text-medium font-semibold">
                  {formatter.format(cartInfo.totalItemBeforeDiscount)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 font-medium">Giảm giá:</div>
                <div className="w-1/2 text-end text-medium font-semibold">
                  {formatter.format(
                    (cartInfo.totalItemDiscountAmount +
                      cartInfo.totalOrderDiscountAmount) *
                      -1
                  )}
                </div>
              </div>

              <div className="flex flex-col text-[14px] font-medium text-zinc-500">
                <RenderIf condition={cartInfo.totalItemDiscountAmount > 0}>
                  <div className="flex">
                    <div className="w-1/2 pl-2">Sản phẩm:</div>
                    <div className="w-1/2 text-end">
                      {formatter.format(cartInfo.totalItemDiscountAmount * -1)}
                    </div>
                  </div>
                </RenderIf>
                <RenderIf condition={cartInfo.totalOrderDiscountAmount > 0}>
                  <div className="flex">
                    <div className="w-1/2 pl-2">Đơn hàng:</div>
                    <div className="w-1/2 text-end">
                      {formatter.format(cartInfo.totalOrderDiscountAmount * -1)}
                    </div>
                  </div>
                </RenderIf>
              </div>

              <div className="w-full h-[1px] bg-black my-4" />

              <div className="flex">
                <div className="w-1/2 font-medium">Tổng</div>
                <div className="w-1/2 text-end font-semibold text-lg">
                  {formatter.format(cartInfo.totalOrderAfterDiscount)}
                </div>
              </div>

              <Button
                color="primary"
                radius="lg"
                className="my-2"
                isDisabled={selectedItems.length === 0}
                isLoading={isCheckoutLoading}
                onClick={handleCheckout}
              >
                Thanh toán
              </Button>

              <RenderIf condition={!(session && !session.terminate)}>
                <div className="text-sm text-zinc-400">
                  Đăng nhập để nhận nhiều ưu đãi và theo dõi đơn hàng dễ dàng
                </div>
              </RenderIf>
            </div>
          </div>
          <div className="my-5 flex items-center justify-center gap-3 text-lg">
            <Button
              as={Link}
              startContent={<MdKeyboardDoubleArrowRight size={20} />}
              endContent={<FaBasketShopping size={20} />}
              color="warning"
              radius="sm"
              variant="bordered"
              href="/collections"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartList;
