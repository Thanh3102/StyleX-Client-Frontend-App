"use client";

import { SyncCart } from "@/app/api/cart";
import { getSession } from "next-auth/react";
import { useEffect } from "react";

const CartSyncCheck = () => {
  const handleSyncCart = async () => {
    const session = await getSession();
    const guestCartId = localStorage.getItem("cartId");
    if (session && !session.terminate && guestCartId) {
      await SyncCart({ guestCartId }, session.accessToken);
      localStorage.removeItem("cartId");
    }
  };

  useEffect(() => {
    handleSyncCart();
  });

  return null;
};
export default CartSyncCheck;
