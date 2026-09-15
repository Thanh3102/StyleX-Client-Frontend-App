import { getCustomerInfo } from "@/app/api/customer";
import { auth } from "@/auth";
import GuestProfile from "@/components/specific/profile/GuestProfile";
import UserProfile from "@/components/specific/profile/UserProfile";

const Page = async () => {
  try {
    const session = await auth()

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

export const dynamic = "force-dynamic";