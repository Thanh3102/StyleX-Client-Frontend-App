import {
  ADD_ITEM_TO_CART_URL,
  ADD_ITEM_TO_GUEST_CART_URL,
  CHANGE_CART_SELECTED_ITEM_URL,
  CHANGE_GUEST_CART_SELECTED_ITEM_URL,
  CHANGE_GUEST_ITEM_VARIANT_URL,
  CHANGE_ITEM_VARIANT_URL,
  DELETE_ITEM_IN_CART_URL,
  DELETE_ITEM_IN_GUEST_CART_URL,
  GET_CART_ITEM_URL,
  GET_GUEST_CART_ITEM_URL,
  SYNC_CART_DATA_URL,
  UPDATE_GUEST_CART_ITEM_QTY_URL,
} from "@/util/constaint/api-routes";
import {
  AddItemData,
  AddItemGuestData,
  CartItem,
  GetCartItem,
  SyncCartData,
  UpdateCartSelectedItemData,
  UpdateGuestCartSelectedItemData,
  UpdateGuestItemVariantData,
  UpdateItemVariantData,
  UpdateQuantityData,
} from "./cart.type";
import { headers } from "next/headers";

export const AddItem = async (
  data: AddItemData,
  token: string | undefined | null
) => {
  try {
    const res = await fetch(ADD_ITEM_TO_CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const UpdateQuantity = async (
  data: UpdateQuantityData,
  token: string | undefined | null
) => {
  try {
    const res = await fetch(ADD_ITEM_TO_CART_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const DeleteItem = async (
  itemId: number,
  token: string | undefined | null
) => {
  try {
    const res = await fetch(`${DELETE_ITEM_IN_CART_URL}/${itemId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const GetCartItems = async (token: string | undefined | null) => {
  try {
    const res = await fetch(`${GET_CART_ITEM_URL}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const response = await res.json();
    if (res.ok) return response as GetCartItem;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const AddItemGuest = async (data: AddItemGuestData) => {
  try {
    const res = await fetch(ADD_ITEM_TO_GUEST_CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string; id?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const GetGuestCartItems = async (cartId: string | null) => {
  try {
    const url = cartId
      ? `${GET_GUEST_CART_ITEM_URL}?cartId=${cartId}`
      : `${GET_GUEST_CART_ITEM_URL}`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    const response = await res.json();
    if (res.ok) return response as GetCartItem;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const UpdateGuestQuantity = async (data: UpdateQuantityData) => {
  try {
    const res = await fetch(UPDATE_GUEST_CART_ITEM_QTY_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const DeleteGuestItem = async (itemId: number) => {
  try {
    const res = await fetch(`${DELETE_ITEM_IN_GUEST_CART_URL}/${itemId}`, {
      method: "DELETE",
    });

    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message ?? "Đã xảy ra lỗi");
  } catch (error: any) {
    throw new Error(error.message ?? "Đã xảy ra lỗi");
  }
};

export const UpdateGuestCartSelectedItem = async (
  data: UpdateGuestCartSelectedItemData
) => {
  try {
    const res = await fetch(CHANGE_GUEST_CART_SELECTED_ITEM_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    return response;
  } catch (error) {}
};

export const UpdateCartSelectedItem = async (
  data: UpdateCartSelectedItemData
) => {
  try {
    const res = await fetch(CHANGE_CART_SELECTED_ITEM_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    return response;
  } catch (error) {}
};

export const SyncCart = async (
  data: SyncCartData,
  token: string | null | undefined
) => {
  try {
    await fetch(SYNC_CART_DATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  } catch (error) {}
};

export const UpdateItemVariant = async (data: UpdateItemVariantData) => {
  try {
    const res = await fetch(CHANGE_ITEM_VARIANT_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) throw new Error(response?.message);

    return response as { message?: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdateGuestItemVariant = async (data: UpdateGuestItemVariantData) => {
  try {
    const res = await fetch(CHANGE_GUEST_ITEM_VARIANT_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    if (!res.ok) throw new Error(response?.message);

    return response as { message?: string };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
