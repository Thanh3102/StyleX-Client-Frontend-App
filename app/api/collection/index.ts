import {
  GET_COLLECTION_DETAIL_URL,
  GET_COLLECTION_URL,
} from "@/util/constaint/api-routes";
import { Collection, GetCollectionResponse } from "./collection.type";

export const GetCollections = async () => {
  try {
    const res = await fetch(GET_COLLECTION_URL, {
      method: "GET",
      cache: "no-cache",
    });
    const data = await res.json();

    if (res.ok) {
      return data as GetCollectionResponse;
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const getCollectionDetail = async (slug: string) => {
  try {
    const url = `${GET_COLLECTION_DETAIL_URL}/${slug}`;
    const res = await fetch(url, { cache: "no-store" });
    const data = (await res.json()) as Collection;

    if (res.ok) {
      return data;
    }

    return null;
  } catch (error) {
    return null;
  }
};
