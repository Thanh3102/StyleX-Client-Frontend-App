import {
  APPLY_VOUCHER_URL,
  CANCEL_ORDER_URL,
  CHECKOUT_ORDER_URL,
  CREATE_CUSTOMER_TEMP_ORDER_URL,
  CREATE_GUEST_TEMP_ORDER_URL,
  GET_ORDER_DATA_URL,
} from "@/util/constaint/api-routes";
import { ApplyVoucherData, CreateTempOrderData, OrderData } from "./order.type";
import { CheckoutData } from "@/components/specific/checkout/FormCheckout";

export const CreateTempOrder = async (
  data: CreateTempOrderData,
  token?: string | null
) => {
  try {
    if (data.type === "Customer") {
      const res = await fetch(CREATE_CUSTOMER_TEMP_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (res.ok) {
        return response as { id: string };
      }
      throw new Error(response.message);
    } else {
      const res = await fetch(CREATE_GUEST_TEMP_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();
      if (res.ok) {
        return response as { id: string };
      }
      throw new Error(response.message);
    }
  } catch (error) {
    throw error;
  }
};

export const GetOrderData = async (orderId: string) => {
  // const JSONbig = require("json-bigint");
  try {
    const res = await fetch(`${GET_ORDER_DATA_URL}/${orderId}`, {
      cache: "no-cache",
    });
    const data = (await res.json()) as OrderData & { message?: string };
    if (res.ok) return data;
    throw new Error(data.message);
  } catch (error) {
    throw error;
  }
};

export const CancelOrder = async (orderId: string) => {
  try {
    const res = await fetch(`${CANCEL_ORDER_URL}/${orderId}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { message?: string };
    if (res.ok) return data;
    throw new Error(data.message);
  } catch (error) {
    throw error;
  }
};

export const CheckoutOrder = async (
  data: CheckoutData & {
    orderId: string;
    userType: "Guest" | "Customer";
    customerId?: string;
  }
) => {
  try {
    const res = await fetch(CHECKOUT_ORDER_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const ApplyVoucher = async (data: ApplyVoucherData) => {
  try {
    const res = await fetch(`${APPLY_VOUCHER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = (await res.json()) as { message?: string };
    if (res.ok) return response;
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};
