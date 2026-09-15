import ResetPasswordForm from "@/components/specific/reset-password/ResetPasswordForm";
import { Spinner } from "@heroui/react";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{ token: string }>;
};
const Page = async (props: Props) => {
  const searchParams = await props.searchParams;

  const {
    token
  } = searchParams;

  return (
    <div className="flex items-center justify-center h-full">
      <Suspense fallback={<Spinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};
export default Page;
