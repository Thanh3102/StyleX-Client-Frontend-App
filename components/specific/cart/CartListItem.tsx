"use client";
import {
  DeleteGuestItem,
  DeleteItem,
  UpdateGuestItemVariant,
  UpdateGuestQuantity,
  UpdateItemVariant,
  UpdateQuantity,
} from "@/app/api/cart";
import { CartItem } from "@/app/api/cart/cart.type";
import RenderIf from "@/components/ui/RenderIf";
import { ASSET_IMAGE_NOT_FOUND } from "@/util/constaint/asset-url";
import { Checkbox, cn, Input, Select, SelectItem } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";

type Props = {
  item: CartItem;
  fetchData: () => void;
};

const CartListItem = ({ item, fetchData }: Props) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [selectedOption, setSelectedOption] = useImmer<{
    [key: string]: string;
  }>({
    option1: item.variant.option1,
    option2: item.variant.option2,
    option3: item.variant.option3,
  });

  const formatter = new Intl.NumberFormat("vi-VN", {
    currency: "vnd",
    style: "currency",
  });

  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    handleUpdateItemVariant();
  }, [selectedOption]);

  const handleUpdateItemVariant = async () => {
    if (
      item.variant.option1 === selectedOption.option1 &&
      item.variant.option2 === selectedOption.option2 &&
      item.variant.option3 === selectedOption.option3
    )
      return;

    const variant = item.product.variants.find(
      (v) =>
        v.option1 === selectedOption.option1 &&
        v.option2 === selectedOption.option2 &&
        v.option3 === selectedOption.option3
    );

    if (!variant) {
      return;
    }

    try {
      const session = await getSession();
      if (session && !session?.terminate) {
        const { message } = await UpdateItemVariant({
          itemId: item.id,
          newVariantId: variant.id,
          token: session?.accessToken,
        });
        if (message) {
          toast.success(message);
          fetchData();
        }
      } else {
        const guestCartId = localStorage.getItem("cartId");
        const { message } = await UpdateGuestItemVariant({
          itemId: item.id,
          newVariantId: variant.id,
          cartId: guestCartId,
        });
        if (message) {
          toast.success(message);
          fetchData();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      fetchData();
    }
  };

  const handleDecreaseQuantity = async () => {
    if (item.avaiable <= 0) return;
    try {
      if (quantity > 1) {
        setQuantity(quantity - 1);
        UpdateItemQuantity(quantity - 1);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const handleIncreaseQuantity = async () => {
    if (item.avaiable <= 0) return;

    try {
      if (quantity < 99) {
        setQuantity(quantity + 1);
        UpdateItemQuantity(quantity + 1);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const handleQuantityChange = async (value: string) => {
    if (item.avaiable <= 0) return;

    let newValue = parseInt(value);

    try {
      if (!value || newValue < 1) {
        newValue = 1;
      }
      if (newValue > 99) {
        newValue = 99;
      }
      setQuantity(newValue);
      UpdateItemQuantity(newValue);
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
    }
  };

  const UpdateItemQuantity = async (newQuantity: number) => {
    if (item.avaiable <= 0) return;

    clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(async () => {
      try {
        const session = await getSession();
        const itemData = { itemId: item.id, quantity: newQuantity };

        if (!session || session.terminate) {
          await UpdateGuestQuantity(itemData);
        } else {
          await UpdateQuantity(itemData, session.accessToken);
        }
        toast.success("Đã cập nhật giỏ hàng");
        fetchData();
      } catch (error: any) {
        toast.error(error.message);
        fetchData();
      }
    }, 400);
  };

  const handleDeleteItem = async () => {
    try {
      const session = await getSession();
      if (!session || session.terminate) {
        await DeleteGuestItem(item.id);
      } else {
        await DeleteItem(item.id, session?.accessToken);
      }
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      fetchData();
    } catch (error: any) {
      toast.error(error.message ?? "Đã xảy ra lỗi");
    }
  };



  return (
    <div className="flex items-center py-2 px-5 text-sm">
      <div className="flex gap-3 w-6/12">
        <Checkbox value={item.id.toString()} isDisabled={item.avaiable <= 0} />
        <div className="w-[100px] h-[150px] rounded-md relative border-1 border-zinc-400">
          <Image
            width={0}
            height={0}
            alt=""
            src={item.product.image ?? ASSET_IMAGE_NOT_FOUND}
            className="rounded-md w-full h-full object-cover"
          />
          <RenderIf condition={item.avaiable <= 0}>
            <div className="absolute top-0 w-full h-full">
              <div className="flex items-center justify-center h-full bg-zinc-500 opacity-90">
                <span className="text-white font-semibold uppercase">
                  Hết hàng
                </span>
              </div>
            </div>
          </RenderIf>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col">
            <Link
              href={`/products/${item.product.id}?v=${item.variant.id}`}
              target="_blank"
            >
              <span className="text-base font-semibold line-clamp-2">
                {item.product.name}
              </span>
            </Link>
            <RenderIf condition={item.variant.title !== "Default Title"}>
              <span className="text-sm text-zinc-500">
                {item.variant.title}
              </span>
            </RenderIf>
            <RenderIf condition={item.options.length > 0}>
              <div className="flex gap-2 py-2">
                {item.options.map((option) => (
                  <Select
                    selectionMode="single"
                    disallowEmptySelection
                    size="sm"
                    key={option.id}
                    defaultSelectedKeys={[
                      selectedOption[`option${option.position}` as string],
                    ]}
                    onSelectionChange={(key) =>
                      setSelectedOption((selectedOption) => {
                        selectedOption[`option${option.position}` as string] =
                          key.anchorKey as string;
                      })
                    }
                  >
                    {option.values.map((value) => (
                      <SelectItem key={value}>{value}</SelectItem>
                    ))}
                  </Select>
                ))}
              </div>
            </RenderIf>
          </div>
          <div
            className="flex gap-1 hover:cursor-pointer items-center text-zinc-400 hover:text-zinc-500"
            onClick={handleDeleteItem}
          >
            <FaTrash />
            <span>Xóa</span>
            {/* <span>Có thể mua: {item.avaiable}</span> */}
          </div>
        </div>
      </div>
      <div className="w-2/12">
        <div className="flex flex-col  gap-2  ">
          <span
            className={cn("font-semibold", {
              "text-sm text-zinc-400 line-through": item.discountAmount > 0,
            })}
          >
            {formatter.format(item.variant.sellPrice)}
          </span>
          <span
            className={cn("font-semibold hidden text-red-500", {
              "inline-block": item.discountAmount > 0,
            })}
          >
            {formatter.format(item.discountPrice)}
          </span>
        </div>
      </div>
      <div className="w-2/12">
        <Input
          type="number"
          radius="full"
          size="sm"
          onValueChange={handleQuantityChange}
          value={quantity.toString()}
          startContent={
            <FaMinus
              onClick={handleDecreaseQuantity}
              className="hover:cursor-pointer"
            />
          }
          endContent={
            <FaPlus
              onClick={handleIncreaseQuantity}
              className="hover:cursor-pointer"
            />
          }
          classNames={{
            input: "text-center",
          }}
        />
      </div>
      <div className="w-2/12 flex justify-end">
        <div className="flex flex-col justify-center items-center gap-2">
          <span
            className={cn("font-semibold", {
              "text-sm text-zinc-400 line-through": item.discountAmount > 0,
            })}
          >
            {formatter.format(item.totalPrice)}
          </span>
          <span
            className={cn("font-semibold hidden text-red-500", {
              "inline-block": item.discountAmount > 0,
            })}
          >
            {formatter.format(item.totalDiscount)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default CartListItem;
