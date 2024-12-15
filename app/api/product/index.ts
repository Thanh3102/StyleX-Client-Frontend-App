import {
  GET_PRODUCT_SEARCH_URL,
  GET_PRODUCT_URL,
} from "@/util/constaint/api-routes";
import {
  GetProductResponse,
  ProductDetail,
  ProductSearchResponse,
} from "./product.type";
import { PublicProductParams } from "@/util/types/backend";

export const GetProduct = async (params: PublicProductParams) => {
  try {
    const search = new URLSearchParams(params).toString();
    const url = `${GET_PRODUCT_URL}?${search}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as GetProductResponse;

    if (res.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    throw new Error("Đã xảy ra lỗi");
  }
};

export const GetProductDetail = async (id: number) => {
  try {
    const url = `${GET_PRODUCT_URL}/${id}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as ProductDetail;

    if (res.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.log(error);

    throw new Error("Đã xảy ra lỗi");
  }
};

export const SearchProduct = async (query: string) => {
  try {
    const res = await fetch(`${GET_PRODUCT_SEARCH_URL}?q=${query}`, {
      cache: "no-store",
    });
    const data = (await res.json()) as ProductSearchResponse;

    if (res.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    throw new Error("Đã xảy ra lỗi");
  }
};
