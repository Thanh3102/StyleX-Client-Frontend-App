import LogoutButton from "@/components/ui/LogoutButton";
import RenderIf from "@/components/ui/RenderIf";
import { nextAuthOptions } from "@/lib/next-auth/nextAuthOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(nextAuthOptions);
  return (
    <>
      <div>Homepage</div>
      <div>
        {session ? `Currrent user: ${session.user.email}` : "Chưa đăng nhập"}
      </div>
      <RenderIf condition={!!session}>
        <LogoutButton />
      </RenderIf>
    </>
  );
}
