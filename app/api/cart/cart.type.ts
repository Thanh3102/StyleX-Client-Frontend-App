import { Promotion } from "../product/product.type";

export interface AddCartItem {
  productId: number;
  variantId: number;
  quantity: number;
}
export interface AddItemData extends AddCartItem {
  userId: string;
}

export interface AddItemGuestData extends AddCartItem {
  cartId: string | null;
}

export type UpdateQuantityData = {
  itemId: number;
  quantity: number;
};

export type UpdateItemVariantData = {
  itemId: number;
  newVariantId: number;
  token: string | undefined | null;
};

export type UpdateGuestItemVariantData = {
  itemId: number;
  newVariantId: number;
  cartId: null | string;
};

export type CartItem = {
  id: number;
  quantity: number;
  avaiable: number;
  selected: boolean;
  options: {
    id: number;
    name: string;
    position: number;
    values: string[];
  }[];
  product: {
    id: number;
    name: string;
    unit: string;
    type: string;
    image: string;
    sellPrice: number;
    variants: Array<{
      id: number;
      option1: string;
      option2: string;
      option3: string;
    }>;
  };
  variant: {
    id: number;
    unit: string;
    image: string;
    sellPrice: number;
    comparePrice: number;
    title: string;
    option1: string;
    option2: string;
    option3: string;
  };
  discountPrice: number;
  discountPercent: number;
  discountAmount: number;
  applyPromotions: Promotion;
  totalDiscount: number;
  totalPrice: number;
};

export type GetCartItem = {
  data: CartItem[];
  totalItemBeforeDiscount: number;
  totalItemAfterDiscount: number;
  totalItemDiscountAmount: number;
  totalOrderBeforeDiscount: number;
  totalOrderAfterDiscount: number;
  totalOrderDiscountAmount: number;
  applyOrderPromotions: Promotion[];
  id?: string;
};

export type UpdateGuestCartSelectedItemData = {
  cartId: string;
  itemIds: number[];
};

export type UpdateCartSelectedItemData = {
  token: string | undefined | null;
  itemIds: number[];
};

export type SyncCartData = {
  guestCartId: string | null;
};
