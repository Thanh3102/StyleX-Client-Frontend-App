"use client";
import { BasicProduct } from "@/app/api/product/product.type";
import AddToCartButton from "@/components/ui/AddToCartButton";
import RenderIf from "@/components/ui/RenderIf";
import { ASSET_IMAGE_NOT_FOUND } from "@/util/constaint/asset-url";
import {
  cn,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CiCircleList } from "react-icons/ci";
import { useImmer } from "use-immer";

type Props = {
  product: BasicProduct;
};

type Promotion = BasicProduct["variants"][0]["applyPromotions"][0];

const ProductCard = ({ product }: Props) => {
  const currency = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "vnd",
  });

  const pathname = usePathname();
  const [outOfStock, setOutOfStock] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<
    BasicProduct["variants"][number]
  >(product.variants[0]);

  const [selectedOptions, setSelectecOptions] = useImmer<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    // Nếu tất cả hết hàng thì disable product này
    const isAllOutOfStock = product.variants.every(
      (variant) => variant.avaiable === 0
    );

    if (isAllOutOfStock) {
      setOutOfStock(true);
      setSelectecOptions({
        option1: product.variants[0].option1,
        option2: product.variants[0].option2,
        option3: product.variants[0].option3,
      });
      setSelectedVariant(product.variants[0]);
    } else {
      const avaiableVariants = product.variants.filter(
        (variant) => variant.avaiable > 0
      );
      const minPriceVariant = avaiableVariants.reduce((min, variant) =>
        variant.sellPrice < min.sellPrice ? variant : min
      );
      setSelectecOptions({
        option1: minPriceVariant.option1,
        option2: minPriceVariant.option2,
        option3: minPriceVariant.option3,
      });
      setSelectedVariant(minPriceVariant);
    }
  }, []);

  useEffect(() => {
    const variant = product.variants.find(
      (v) =>
        v.option1 === selectedOptions.option1 &&
        v.option2 === selectedOptions.option2 &&
        v.option3 === selectedOptions.option3
    );

    if (variant) setSelectedVariant(variant);
  }, [selectedOptions]);

  // const availableOptions = useMemo(() => {
  //   const availableOptions: { [key: string]: Set<string> } = {
  //     option1: new Set<string>(),
  //     option2: new Set<string>(),
  //     option3: new Set<string>(),
  //   };

  //   product.variants.forEach((variant) => {
  //     if (variant.avaiable > 0) {
  //       // Nếu variant khớp với lựa chọn hiện tại, thêm vào availableOptions
  //       if (
  //         selectedOptions.option1 === null ||
  //         selectedOptions.option1 === variant.option1
  //       ) {
  //         if (variant.option1) availableOptions.option1.add(variant.option1);
  //       }
  //       if (
  //         selectedOptions.option2 === null ||
  //         selectedOptions.option2 === variant.option2
  //       ) {
  //         if (variant.option2) availableOptions.option2.add(variant.option2);
  //       }
  //       if (
  //         selectedOptions.option3 === null ||
  //         selectedOptions.option3 === variant.option3
  //       ) {
  //         if (variant.option3) availableOptions.option3.add(variant.option3);
  //       }
  //     }
  //   });

  //   return availableOptions;
  // }, [selectedOptions, selectedVariant]);

  const productDetailUrl = `/products/${product.id}?v=${selectedVariant.id}`;

  const renderPromotion = (promotions: Promotion[]) => {
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
              {currency.format(promotion.amount * -1)}
            </div>
          </div>
        ))}
      </div>
    );
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

  const handleChangeOption = (position: number, value: string) => {
    setSelectecOptions((option) => {
      option[`option${position}`] = value;
    });
  };

  return (
    <div className="flex flex-col">
      <Link href={productDetailUrl}>
        <div
          className={cn(
            "w-full aspect-[3/4] rounded-xl relative group",
            "border-1 border-gray-400 hover:cursor-pointer hover:border-blue-300 hover:border-2"
          )}
        >
          <Image
            width={100}
            height={100}
            alt=""
            src={product.image ?? ASSET_IMAGE_NOT_FOUND}
            className="object-fill w-full h-full rounded-xl"
          />

          <RenderIf condition={selectedVariant.avaiable === 0}>
            <div className="absolute top-0 w-full h-full z-10">
              <div className="flex items-center justify-center h-full text-xl bg-[rgba(167,168,172,0.8)]">
                <span className="text-white p-2 rounded-sm">
                  HẾT HÀNG
                </span>
              </div>
            </div>
          </RenderIf>

          <div className="w-full h-full top-0 absolute bg-[rgba(0,0,0,0.01)] hidden group-hover:block p-2">
            <div
              className={cn("flex flex-col justify-between h-full", {
                "justify-end": product.options.length === 0,
              })}
            >
              <RenderIf condition={product.options.length > 0}>
                <Popover
                  placement="bottom-start"
                  showArrow
                  classNames={{
                    content: "bg-[--tooltip-bg-color] text-white p-4",
                  }}
                >
                  <PopoverTrigger>
                    <div className="">
                      <Tooltip content="Chọn thuộc tính" showArrow>
                        <div
                          className="p-1 rounded-md hover:cursor-pointer bg-blue-500 text-white w-fit shadow-xl"
                          onClick={(e) => e.preventDefault()}
                        >
                          <CiCircleList />
                        </div>
                      </Tooltip>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="w-full flex flex-col gap-1">
                      {product.options.map((option) => (
                        <div className="flex flex-col gap-1" key={option.id}>
                          <span className="text-base font-medium">
                            {option.name}
                          </span>
                          <div className="flex gap-2 overflow-x-auto">
                            {option.values.map((value) => (
                              <div
                                key={option.id + value}
                                className={cn(
                                  "px-2 py-1 border-1 min-w-10 text-center rounded-sm",
                                  "hover:cursor-pointer hover:bg-blue-500",
                                  {
                                    "bg-blue-500":
                                      selectedOptions[
                                        `option${option.position}`
                                      ] === value,
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
                  </PopoverContent>
                </Popover>
              </RenderIf>

              <div className="flex justify-center">
                <RenderIf condition={selectedVariant.avaiable > 0}>
                  <AddToCartButton
                    className="bg-yellow-500 text-white"
                    item={{
                      product: product,
                      variant: selectedVariant,
                      quantity: 1,
                    }}
                  />
                </RenderIf>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="flex flex-col mt-2">
        <Link href={productDetailUrl} className="text-black">
          <span className="text-base leading-5">{product.name}</span>
        </Link>
        <span
          className={cn("text-lg font-bold", {
            "line-through text-base text-zinc-500":
              selectedVariant.discountPrice,
          })}
        >
          {currency.format(selectedVariant.sellPrice)}
        </span>
        <RenderIf condition={!!selectedVariant.discountPrice}>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg text-red-500 font-bold")}>
              {selectedVariant.discountPrice &&
                currency.format(selectedVariant.discountPrice)}
            </span>
            {selectedVariant.discountPrice && (
              <Tooltip
                content={renderPromotion(selectedVariant.applyPromotions)}
                showArrow
              >
                <span className="py-1 px-2 rounded-md bg-red-500 text-white text-xs italic">{`Tiết kiệm ${selectedVariant.discountPercent}%`}</span>
              </Tooltip>
            )}
          </div>
        </RenderIf>
        {renderQuantityStatus(selectedVariant.avaiable)}
      </div>
    </div>
  );
};
export default ProductCard;
