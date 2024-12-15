import { GetCartItems } from "@/app/api/cart";
import CartList from "@/components/specific/cart/CartList";
import LoginModal from "@/components/ui/LoginModal";
import { nextAuthOptions } from "@/lib/next-auth/nextAuthOptions";
import { getServerSession } from "next-auth";

// const getCartItems = async () => {
//   try {
//     const session = await getServerSession(nextAuthOptions);
//     const items = await GetCartItems(session?.accessToken);
//     return items;
//   } catch {
//     return [];
//   }
// };

const Page = async () => {
  // const session = await getServerSession(nextAuthOptions);
  // let cartItems
  // if (!session || session.terminate) {
  //   // return <LoginModal redirect="/cart" />;
  //   cartItems = await getGuestCartItems();

  // }
  // else{
  //   cartItems = await getCartItems();
  // }


  return (
    <div className="px-20 py-5">
      <h4 className="text-xl font-bold">Giỏ hàng</h4>
      <CartList />
    </div>
  );
};
export default Page;
