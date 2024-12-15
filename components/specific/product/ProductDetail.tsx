"use client";
import { ProductDetail as PD } from "@/app/api/product/product.type";
import ProductImageSwiper from "./ProductImageSwiper";
import {
  Accordion,
  AccordionItem,
  Button,
  cn,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import DOMPurify from "isomorphic-dompurify";
import RenderIf from "@/components/ui/RenderIf";
import Image from "next/image";
import { ASSET_IMAGE_NOT_FOUND } from "@/util/constaint/asset-url";
import { FaCartShopping, FaLeftLong, FaMinus, FaPlus } from "react-icons/fa6";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductDescription from "./ProductDescription";
import CustomBreadcrumbs, { BreadcrumItemType } from "@/components/ui/CustomBreadcrumbs";

type Props = {
  product: PD;
  variantId?: number;
};
type AvailableOption = {
  position: number;
  values: string[];
};

type Promotion = PD["variants"][0]["applyPromotions"][0];

const ProductDetail = ({ product, variantId }: Props) => {
  const currencyFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });

  const [selectedOptions, setSelectecOptions] = useImmer<{
    [key: string]: string | null;
  }>({
    option1: product.variants[0].option1,
    option2: product.variants[0].option2,
    option3: product.variants[0].option3,
  });

  const [selectedVariant, setSelectedVariant] = useState<
    PD["variants"][number]
  >(() => {
    if (variantId) {
      const index = product.variants.findIndex((item) => item.id === variantId);

      if (index !== -1) {
        setSelectecOptions({
          option1: product.variants[index].option1,
          option2: product.variants[index].option2,
          option3: product.variants[index].option3,
        });
        return product.variants[index];
      }
    }

    setSelectecOptions({
      option1: product.variants[0].option1,
      option2: product.variants[0].option2,
      option3: product.variants[0].option3,
    });
    return product.variants[0];
  });

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const variant = product.variants.find(
      (v) =>
        v.option1 === selectedOptions.option1 &&
        v.option2 === selectedOptions.option2 &&
        v.option3 === selectedOptions.option3
    );

    if (variant) setSelectedVariant(variant);
  }, [selectedOptions]);

  const handleChangeOption = (position: number, value: string) => {
    setSelectecOptions((option) => {
      option[`option${position}`] = value;
    });
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (quantity < 99) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (value: string) => {
    if (!value || parseInt(value) < 1) {
      setQuantity(1);
      return;
    }
    if (parseInt(value) > 99) {
      setQuantity(99);
      return;
    }

    setQuantity(parseInt(value));
  };

  const renderQuantityStatus = (quantity: number) => {
    if (quantity <= 0) {
      return <span className="text-red-500">Đã hết hàng</span>;
    }
    if (quantity < 30) {
      return <span className="text-yellow-500">Còn ít hàng</span>;
    }
    return <span className="text-green-500">Có thể mua</span>;
  };

  const renderPromotion = (promotions: Promotion[]) => {
    return (
      <div className="w-[300px] p-2 rounded-md flex flex-col gap-2">
        {promotions.map((promotion) => (
          <div className="flex" key={promotion.id}>
            <div className="flex-[2] flex-col">
              <div className="font-medium text-sm">{promotion.title}</div>
              <div className="text-zinc-400 text-xs">
                {promotion.description}
              </div>
            </div>
            <div className="flex-1 flex justify-end font-semibold">
              {currencyFormatter.format(promotion.amount * -1)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const cleanHtmlDescription = product.shortDescription
    ? DOMPurify.sanitize(product.shortDescription)
    : "";

  const breadcrumbItems: BreadcrumItemType[] = [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: `Tất cả sản phẩm`,
      href: "/collections",
    },
    {
      title: product.name,
      isCurrent: true,
    },
  ];

  return (
    <>
      <div className="pb-5">
        <CustomBreadcrumbs items={breadcrumbItems} />
      </div>
      <div className="flex gap-5 relative">
        <div className="flex-1 flex-col">
          <div className="flex h-[500px] gap-2">
            <RenderIf condition={product.images.length > 0}>
              <ProductImageSwiper images={product.images} />
            </RenderIf>
            <RenderIf condition={product.images.length === 0}>
              <div className="h-full w-full">
                <img
                  alt=""
                  src={ASSET_IMAGE_NOT_FOUND}
                  className="w-full h-full object-fill border-1 border-zinc-300 rounded-lg"
                />
              </div>
            </RenderIf>
          </div>
          <Accordion
            defaultExpandedKeys={[
              "shortDescription",
              "promotions",
              "description",
            ]}
            selectionMode="multiple"
            itemClasses={{
              titleWrapper: "p-0",
              title: "font-bold text-lg",
              trigger: "p-2",
              content: "p-2 pt-0",
              base: "pt-2",
            }}
          >
            <AccordionItem title="Đặc điểm nổi bật" key={"shortDescription"}>
              <div dangerouslySetInnerHTML={{ __html: cleanHtmlDescription }} />
            </AccordionItem>
            <AccordionItem
              title="Chương trình khuyến mại"
              subtitle="Hệ thống sẽ chọn khuyến mại có giá trị cao nhất cho bạn. Nếu khuyến mại có thể kết hợp, bạn sẽ nhận được tất cả ưu đãi."
              key={"promotions"}
            >
              <ul>
                {selectedVariant.activePromotions.map((promo) => (
                  <li key={promo.id} className="flex flex-col py-1">
                    <div className="text-base font-medium">{`${promo.title} ${
                      promo.prerequisite !== "none"
                        ? "(Áp dụng khi thanh toán)"
                        : ""
                    }`}</div>
                    <div className="text-sm text-zinc-400">
                      {promo.description}
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Chi tiết sản phẩm" key={"description"}>
              <ProductDescription description={product.description} />
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex-[1] sticky top-20 self-start">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-3xl">{product.name}</span>
            <div className="flex items-center gap-4">
              <RenderIf condition={selectedVariant.title !== "Default Title"}>
                <span className="text-zinc-400 text-sm">
                  {selectedVariant.title}
                </span>
              </RenderIf>
              {renderQuantityStatus(selectedVariant.avaiable)}
            </div>
            <span
              className={cn("font-bold text-2xl", {
                "text-base line-through text-zinc-500":
                  !!selectedVariant.discountPrice,
              })}
            >
              {currencyFormatter.format(selectedVariant.sellPrice)}
            </span>
            <RenderIf condition={!!selectedVariant.discountPrice}>
              <div className="flex items-center flex-wrap gap-4">
                <span className="font-bold text-2xl text-red-500">
                  {selectedVariant.discountPrice &&
                    currencyFormatter.format(selectedVariant.discountPrice)}
                </span>
                <Tooltip
                  content={renderPromotion(selectedVariant.applyPromotions)}
                  showArrow
                >
                  <span className="py-1 px-2 rounded-md bg-red-500 text-white text-xs italic">{`Tiết kiệm ${selectedVariant.discountPercent}%`}</span>
                </Tooltip>
              </div>
            </RenderIf>
            <div className="w-full flex flex-col gap-1">
              {product.options.map((option) => (
                <div className="flex flex-col gap-1" key={option.id}>
                  <span className="text-base font-medium">
                    {option.name}:{" "}
                    <span className="font-bold">
                      {selectedOptions[`option${option.position}`]}
                    </span>
                  </span>

                  <div className="flex gap-2 overflow-x-auto flex-wrap">
                    {option.values.map((value) => (
                      <div
                        key={`${option.id}-${value}`}
                        className={cn(
                          "px-2 py-2 border-1 min-w-20 text-center rounded-md bg-zinc-300",
                          "hover:cursor-pointer",
                          {
                            "bg-black text-white":
                              selectedOptions[`option${option.position}`] ===
                              value,
                          }
                        )}
                        onClick={() =>
                          handleChangeOption(option.position, value)
                        }
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="my-4 flex gap-2">
              <Input
                type="number"
                variant="bordered"
                value={quantity.toString()}
                radius="full"
                min={1}
                max={99}
                onValueChange={handleQuantityChange}
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
                className="w-28"
                classNames={{
                  input: "text-center justify-center",
                }}
              />
              <AddToCartButton
                className="bg-black text-white"
                item={{
                  product: product,
                  quantity: quantity,
                  variant: selectedVariant,
                }}
                buttonProps={{
                  isDisabled: selectedVariant.avaiable === 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductDetail;
