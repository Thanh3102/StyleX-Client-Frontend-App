import CartList from "@/components/specific/cart/CartList";

const Page = async () => {
  return (
    <div className="px-20 py-5">
      <h4 className="text-xl font-bold">Giỏ hàng</h4>
      <CartList />
    </div>
  );
};
export default Page;
