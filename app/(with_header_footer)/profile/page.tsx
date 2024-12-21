import { getCustomerInfo } from "@/app/api/customer";
import GuestProfile from "@/components/specific/profile/GuestProfile";
import UserProfile from "@/components/specific/profile/UserProfile";
import { nextAuthOptions } from "@/lib/next-auth/nextAuthOptions";
import { getServerSession } from "next-auth";

const Page = async () => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (session && !session.terminate) {
      const user = await getCustomerInfo(session?.accessToken);
      return (
        <div className="px-10 py-10 w-1/2">
          <UserProfile user={user} />
        </div>
      );
    }
    return <GuestProfile />;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export default Page;
