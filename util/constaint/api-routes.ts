export const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
export const SIGN_UP_URL = `${BASE_URL}/auth/customer/signup`;
export const SIGN_IN_URL = `${BASE_URL}/auth/customer/signin`;
export const VERIFY_SIGN_UP_URL = `${BASE_URL}/auth/customer/signup/verify`;
export const REFRESH_TOKEN_ROUTE = `${BASE_URL}/auth/refreshToken`;

export const GET_PRODUCT_URL = `${BASE_URL}/api/product/public`;
export const GET_PRODUCT_SEARCH_URL = `${BASE_URL}/api/product/public/search`;
export const GET_COLLECTION_URL = `${BASE_URL}/api/product/collection`;
export const GET_COLLECTION_DETAIL_URL = `${BASE_URL}/api/product/public/collection`;

export const GET_ACTIVE_DISCOUNT_URL = `${BASE_URL}/api/discount/active`;

export const SYNC_CART_DATA_URL = `${BASE_URL}/api/cart/sync`;
export const GET_CART_ITEM_URL = `${BASE_URL}/api/cart`;
export const ADD_ITEM_TO_CART_URL = `${BASE_URL}/api/cart`;
export const UPDATE_CART_ITEM_QTY_URL = `${BASE_URL}/api/cart`;
export const DELETE_ITEM_IN_CART_URL = `${BASE_URL}/api/cart`;
export const CHANGE_CART_SELECTED_ITEM_URL = `${BASE_URL}/api/cart/select`;
export const CHANGE_ITEM_VARIANT_URL = `${BASE_URL}/api/cart/variant`;

export const GET_GUEST_CART_ITEM_URL = `${BASE_URL}/api/cart/guest`;
export const ADD_ITEM_TO_GUEST_CART_URL = `${BASE_URL}/api/cart/guest`;
export const UPDATE_GUEST_CART_ITEM_QTY_URL = `${BASE_URL}/api/cart/guest`;
export const DELETE_ITEM_IN_GUEST_CART_URL = `${BASE_URL}/api/cart/guest`;
export const CHANGE_GUEST_CART_SELECTED_ITEM_URL = `${BASE_URL}/api/cart/guest/select`;
export const CHANGE_GUEST_ITEM_VARIANT_URL = `${BASE_URL}/api/cart/guest/variant`;

export const CREATE_CUSTOMER_TEMP_ORDER_URL = `${BASE_URL}/api/order`;
export const CREATE_GUEST_TEMP_ORDER_URL = `${BASE_URL}/api/order/guest`;

export const GET_ORDER_DATA_URL = `${BASE_URL}/api/order`;
export const CANCEL_ORDER_URL = `${BASE_URL}/api/order`;
export const CHECKOUT_ORDER_URL = `${BASE_URL}/api/order`;
export const APPLY_VOUCHER_URL = `${BASE_URL}/api/order/voucher`;

