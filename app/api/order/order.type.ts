export type CreateTempOrderData = {
  type: "Guest" | "Customer";
  cartItemIds: number[];
};

export type OrderData = {
  id: string;
  totalItemAfterDiscount: number;
  totalItemBeforeDiscount: number;
  totalItemDiscountAmount: number;
  totalOrderAfterDiscount: number;
  totalOrderBeforeDiscount: number;
  totalOrderDiscountAmount: number;
  expire: number;
  items: OrderItemData[];
};

export type OrderItemData = {
  id: number;
  orderId: string;
  discountAmount: number;
  priceAfterDiscount: number;
  priceBeforeDiscount: number;
  product: {
    image: null | string;
    name: string;
  };
  productId: number;
  quantity: number;
  totalDiscountAmount: number;
  totalPriceAfterDiscount: number;
  totalPriceBeforeDiscount: number;
  variant: { image: null; title: string };
  variantId: number;
};

export type ApplyVoucherData = {
  orderId: string;
  voucherCode: string;
};
