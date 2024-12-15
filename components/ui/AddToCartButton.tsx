"use client";
import { Button, ButtonProps, cn, Link } from "@nextui-org/react";
import { getSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AddItem, AddItemGuest } from "@/app/api/cart";
import { BasicProduct } from "@/app/api/product/product.type";
import { ASSET_IMAGE_NOT_FOUND } from "@/util/constaint/asset-url";
import RenderIf from "./RenderIf";
import { Session } from "next-auth";

interface Props {
  className?: string;
  item: {
    product: Pick<BasicProduct, "id" | "name" | "image">;
    variant: Pick<
      BasicProduct["variants"][0],
      | "id"
      | "sellPrice"
      | "image"
      | "title"
      | "discountPercent"
      | "discountPrice"
    >;
    quantity: number;
  };
  buttonProps?: ButtonProps;
}
const AddToCartButton = ({ className, item, buttonProps }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  // const pathname = usePathname();
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "vnd",
    });
  }, []);

  const ToastComponent = () => (
    <>
      <div className="p-2 text-sm border-b-1 font-semibold">
        Đã thêm vào giỏ hàng
      </div>
      <div className="flex flex-col p-2 gap-5">
        <div className="flex h-full gap-5">
          <div className="flex w-32 aspect-[2/3] rounded-md border-1 border-zinc-400">
            <img
              src={item.product.image ?? ASSET_IMAGE_NOT_FOUND}
              alt=""
              className="max-w-full max-h-full object-fill rounded-md"
            />
          </div>
          <div className="flex flex-col text-sm text-black justify-between">
            <div className="">
              <div className="font-medium">{item.product.name}</div>
              <div className="test-xs text-zinc-400">{item.variant.title}</div>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <RenderIf condition={!!item.variant.discountPrice}>
                <div className="text-red-500 font-medium">
                  {currencyFormatter.format(item.variant.discountPrice ?? 0)}
                </div>
              </RenderIf>
              <div
                className={cn("font-medium", {
                  "line-through text-zinc-400 font-semibold":
                    item.variant.discountPrice,
                })}
              >
                {currencyFormatter.format(item.variant.sellPrice)}
              </div>
            </div>
          </div>
        </div>
        <Button
          as={Link}
          color="primary"
          radius="lg"
          variant="bordered"
          href="/cart"
        >
          Xem giỏ hàng
        </Button>
      </div>
    </>
  );

  const handleGuestAdd = async () => {
    try {
      const cartId = localStorage.getItem("cartId");
      const { id } = await AddItemGuest({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        cartId: cartId,
      });
      toast(<ToastComponent />, { autoClose: 3000 });
      if (id) {
        localStorage.setItem("cartId", id);
      }
    } catch (error: any) {
      toast.error(
        error.message ?? "Thêm vào giỏ hàng không thành công. Vui lòng thử lại"
      );
    }
  };

  const handleAdd = async (session: Session) => {
    await AddItem(
      {
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        userId: session.user.id,
      },
      session.accessToken
    );
    toast(<ToastComponent />, { autoClose: 3000 });
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      const session = await getSession();
      if (!session || session.terminate) {
        // Khi chưa đăng nhập
        handleGuestAdd();
      } else {
        // Nếu đã đăng nhập
        handleAdd(session);
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message ?? "Thêm thất bại. Vui lòng thử lại");
    }
  };
  return (
    <>
      <Button
        startContent={!isLoading && <FaCartShopping />}
        isLoading={isLoading}
        className={cn(className)}
        onClick={handleClick}
        {...buttonProps}
      >
        Thêm vào giỏ hàng
      </Button>
      {/* {isOpenLogin && (
        <LoginModal
          redirect={pathname}
          onLoginClose={() => setIsOpenLogin(false)}
          onLoginSuccess={() => setIsOpenLogin(false)}
        />
      )} */}
    </>
  );
};
export default AddToCartButton;
