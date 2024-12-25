import {
  CHANGE_USER_PASSWORD,
  FORGET_PASSWORD_ROUTE,
  GET_ORDER_HISTORY,
  GET_USER_INFO,
  RESET_PASSWORD_ROUTE,
  UPDATE_USER_INFO,
} from "@/util/constaint/api-routes";
import {
  ChangePasswordDto,
  CustomerInfo,
  OrderHistory,
  UpdateInfoDto,
} from "./customer.type";

export const getCustomerInfo = async (
  accessToken: string | null | undefined
) => {
  try {
    const res = await fetch(GET_USER_INFO, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data as CustomerInfo;
    }
    throw new Error(data.message || res.statusText);
  } catch (error) {
    throw error;
  }
};

export const updateCustomerInfo = async (
  dto: UpdateInfoDto,
  accessToken: string | undefined | null
) => {
  try {
    const res = await fetch(UPDATE_USER_INFO, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await res.json();
    if (res.ok) {
      return data as { message: string };
    }

    throw new Error(data.message || res.statusText);
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  dto: ChangePasswordDto,
  accessToken: string | undefined | null
) => {
  try {
    const res = await fetch(CHANGE_USER_PASSWORD, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await res.json();
    if (res.ok) {
      return data as { message: string };
    }

    throw new Error(data.message || res.statusText);
  } catch (error) {
    throw error;
  }
};

export const getCustomerOrderHistory = async (
  query: {
    status: string;
    page: string;
    limit: string;
  },
  accessToken: string | undefined | null
) => {
  try {
    const search = new URLSearchParams(query).toString();
    const url = `${GET_ORDER_HISTORY}?${search}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data as OrderHistory;
    }
    throw new Error(data.message || res.statusText);
  } catch (error) {
    throw error;
  }
};

export const requestResetPassword = async (email: string) => {
  try {
    const res = await fetch(FORGET_PASSWORD_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const response = (await res.json()) as { message: string };
    if (res.ok) {
      return response;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const res = await fetch(RESET_PASSWORD_ROUTE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });
    const response = (await res.json()) as { message: string };
    if (res.ok) {
      return response;
    }
    throw new Error(response.message);
  } catch (error) {
    throw error;
  }
};
