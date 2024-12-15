import GuestProfile from "@/components/specific/profile/GuestProfile";
import LoginModal from "@/components/ui/LoginModal";
import LogoutButton from "@/components/ui/LogoutButton";
import { nextAuthOptions } from "@/lib/next-auth/nextAuthOptions";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(nextAuthOptions);

  if (session && !session.terminate) {
    return (
      <div className="flex flex-col gap-2">
        <span>Profile page</span>
        <span>Name: {session.user.name}</span>
        <span>Email: {session.user.email}</span>
      </div>
    );
  }

  return <GuestProfile/>
};
export default Page;
