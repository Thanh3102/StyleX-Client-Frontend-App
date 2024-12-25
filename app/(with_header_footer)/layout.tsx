import Header from "@/components/layout/Header";
import CartSyncCheck from "@/components/specific/cart/CartSyncCheck";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="h-screen flex flex-col overflow-auto relative">
        <Header />
        <div className="flex-1">{children}</div>
        {/* <div className="bg-green-300 py-4">Footer</div> */}
      </div>

      <CartSyncCheck />
    </>
  );
};
export default Layout;
