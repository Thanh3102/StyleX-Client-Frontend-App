import { getCustomerOrderHistory } from "@/app/api/customer";
import OrderStatusFilter from "@/components/specific/history/OrderStatusFilter";
import OrderTable from "@/components/specific/history/OrderTable";
import GuestProfile from "@/components/specific/profile/GuestProfile";
import { nextAuthOptions } from "@/lib/next-auth/nextAuthOptions";
import { getServerSession } from "next-auth";

type Props = {
  searchParams: { status: string; page: string; limit: string };
};
const Page = async ({ searchParams }: Props) => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (session && !session.terminate) {
      const orderHistory = await getCustomerOrderHistory(
        searchParams,
        session?.accessToken
      );
      return (
        <div className="px-20 py-5">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-xl font-medium">Lịch sử đơn hàng</h1>
            <OrderStatusFilter />
          </div>
          <div className="mt-2">
            <OrderTable
              orders={orderHistory.orders}
              paginition={{
                count: orderHistory.paginition.count,
                page: orderHistory.paginition.page,
                limit: orderHistory.paginition.limit,
                total: orderHistory.paginition.total,
              }}
            />
          </div>
        </div>
      );
    }
    return <GuestProfile />;
  } catch (error) {
    return <div>Đã có lỗi xảy ra</div>;
  }
};
export default Page;
